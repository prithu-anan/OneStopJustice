import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LLMConfig } from '@/components/LLMConfig';
import { llmService } from '@/lib/llmService';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Settings() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Check if API key exists in environment or localStorage
    setHasApiKey(llmService.hasApiKey());
  }, []);

  const handleApiKeySet = (apiKey: string) => {
    setHasApiKey(!!apiKey);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your account and application preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* AI Configuration */}
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🤖</span>
                AI Assistant Configuration
              </CardTitle>
              <CardDescription>
                Configure AI-powered features for intelligent grievance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LLMConfig onApiKeySet={handleApiKeySet} />
            </CardContent>
          </Card>

          {/* Feature Information */}
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
              <CardDescription>
                Learn about the AI-powered features available in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Auto-Detection for Grievances</h4>
                <p className="text-sm text-muted-foreground">
                  When filing a grievance, the AI can automatically analyze your subject and description 
                  to suggest the most appropriate category, department, and authority. It also provides 
                  intelligent SLA (Service Level Agreement) recommendations based on the complexity and 
                  urgency of your case.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Dynamic SLA Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  Instead of using hardcoded response times, the system now uses AI to determine 
                  appropriate SLA periods based on the nature of your grievance. Simple issues get 
                  shorter response times, while complex cases get more time for proper resolution.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Privacy & Security</h4>
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally in your browser and is only used to communicate 
                  directly with Google's Gemini API. No data is sent to our servers for AI processing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    AI Assistant: {hasApiKey ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
                {hasApiKey && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>You can now use auto-detection features when filing grievances</p>
                    <p>Source: {llmService.getApiKeySource() === 'env' ? 'Environment Variable' : 'Manual Configuration'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}