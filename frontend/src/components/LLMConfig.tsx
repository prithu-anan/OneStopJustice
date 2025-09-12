import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { llmService } from '@/lib/llmService';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface LLMConfigProps {
  onApiKeySet?: (apiKey: string) => void;
}

export function LLMConfig({ onApiKeySet }: LLMConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [keySource, setKeySource] = useState<'env' | 'localStorage' | 'none'>('none');
  const { toast } = useToast();

  // Check initial API key status
  useEffect(() => {
    const source = llmService.getApiKeySource();
    setKeySource(source);
    setIsValid(llmService.hasApiKey());
    if (source === 'localStorage') {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) setApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive'
      });
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    try {
      // Test the API key by making a simple call
      llmService.setApiKey(apiKey.trim());
      
      // Make a test call to validate the API key
      const testResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey.trim(),
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Hello'
              }]
            }]
          })
        }
      );

      if (testResponse.ok) {
        setIsValid(true);
        setKeySource('localStorage');
        toast({
          title: 'Success',
          description: 'API key validated successfully'
        });
        onApiKeySet?.(apiKey.trim());
        localStorage.setItem('gemini_api_key', apiKey.trim());
      } else {
        setIsValid(false);
        toast({
          title: 'Invalid API Key',
          description: 'Please check your Gemini API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setIsValid(false);
      toast({
        title: 'Error',
        description: 'Failed to validate API key',
        variant: 'destructive'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    setKeySource('none');
    llmService.setApiKey('');
    localStorage.removeItem('gemini_api_key');
    onApiKeySet?.('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
        <CardDescription>
          Configure Gemini API for intelligent grievance analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className={isValid === false ? 'border-destructive' : isValid === true ? 'border-green-500' : ''}
              />
              {isValid === true && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {isValid === false && (
                <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {isValid === false && (
          <Alert variant="destructive">
            <AlertDescription>
              Invalid API key. Please check your Gemini API key and try again.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={validateApiKey}
            disabled={isValidating || !apiKey.trim()}
            className="flex-1"
          >
            {isValidating ? 'Validating...' : 'Validate & Save'}
          </Button>
          {isValid === true && (
            <Button
              onClick={clearApiKey}
              variant="outline"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Current Status */}
        {keySource !== 'none' && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <AlertDescription>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  API Key {keySource === 'env' ? 'loaded from environment' : 'configured'}
                </span>
              </div>
              {keySource === 'env' && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Using API key from .env file
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription>
            <strong>How to get your Gemini API key:</strong>
            <br />
            1. Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            <br />
            2. Create a new API key
            <br />
            3. Copy and paste it here
            <br />
            <br />
            <strong>Alternative:</strong> Set VITE_GEMINI_API_KEY in your .env file
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
