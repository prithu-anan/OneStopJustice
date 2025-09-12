import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useGrievanceStore } from '@/store/grievanceStore';
import { EscalationRule } from '@/lib/grievance';
import { llmService, LLMAnalysisResult } from '@/lib/llmService';
import { AlertCircle, ArrowLeft, Paperclip, Send, Wand2, Loader2 } from 'lucide-react';

interface FormData {
  category: string;
  departmentId: string;
  authorityId: string;
  subject: string;
  description: string;
  desiredOutcome: string;
  shareContact: boolean;
}

export default function FileGrievance() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authorities, rules, fileGrievance, seedDemoData } = useGrievanceStore();

  useEffect(() => { seedDemoData(); }, [seedDemoData]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'CITIZEN') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const categories = useMemo(() => Array.from(new Set(rules.map((r) => r.category))), [rules]);
  const departments = useMemo(() => Array.from(new Set(rules.map((r) => r.departmentId))), [rules]);

  const [form, setForm] = useState<FormData>({
    category: '',
    departmentId: '',
    authorityId: '',
    subject: '',
    description: '',
    desiredOutcome: '',
    shareContact: true,
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableRules: EscalationRule[] = useMemo(
    () => rules.filter((r) => (!form.category || r.category === form.category) && (!form.departmentId || r.departmentId === form.departmentId)),
    [rules, form.category, form.departmentId]
  );
  const firstRule = availableRules[0];
  const level0AuthorityId = firstRule?.levels[0] || '';
  const availableAuthorities = useMemo(
    () => authorities.filter((a) => (!form.departmentId || a.departmentId === form.departmentId)),
    [authorities, form.departmentId]
  );

  useEffect(() => {
    if (firstRule && level0AuthorityId) {
      setForm((f) => ({ ...f, authorityId: level0AuthorityId }));
    }
  }, [firstRule, level0AuthorityId]);

  const onChange = (key: keyof FormData, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };


  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.category || form.category.startsWith('auto-detect-')) e.category = 'Select a category';
    if (!form.departmentId || form.departmentId.startsWith('auto-detect-')) e.departmentId = 'Select a department';
    if (!form.authorityId || form.authorityId.startsWith('auto-detect-')) e.authorityId = 'Select an authority';
    if (!form.subject || form.subject.trim().length < 5) e.subject = 'Min 5 characters';
    if (!form.description || form.description.trim().length < 20) e.description = 'Min 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const max = 5;
    const arr = [...attachments];
    for (let i = 0; i < files.length && arr.length < max; i++) arr.push(files[i]);
    setAttachments(arr);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'User not found', variant: 'destructive' });
      return;
    }
    
    // Check if subject and description are filled
    if (!form.subject.trim() || !form.description.trim()) {
      toast({ title: 'Validation error', description: 'Subject and description are required', variant: 'destructive' });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Always perform LLM analysis to determine category, department, authority, and SLA
      const analysis = await llmService.analyzeGrievance(
        {
          subject: form.subject,
          description: form.description,
          desiredOutcome: form.desiredOutcome
        },
        authorities,
        rules
      );
      
      // Use LLM suggestions for auto-detect fields, otherwise use user selections
      const finalCategory = form.category.startsWith('auto-detect-') ? analysis.category : form.category;
      const finalDepartmentId = form.departmentId.startsWith('auto-detect-') ? analysis.departmentId : form.departmentId;
      const finalAuthorityId = form.authorityId.startsWith('auto-detect-') ? analysis.authorityId : form.authorityId;
      
      const newG = fileGrievance({
        citizenId: user.id,
        category: finalCategory,
        departmentId: finalDepartmentId,
        authorityId: finalAuthorityId,
        subject: form.subject,
        description: form.description,
        desiredOutcome: form.desiredOutcome,
        attachments: attachments.map((f) => f.name),
        slaDays: analysis.suggestedSlaDays,
        privacy: { shareContact: form.shareContact },
      });
      
      toast({ 
        title: 'Grievance submitted', 
        description: `Tracking ID ${newG.id}. SLA: ${analysis.suggestedSlaDays} days` 
      });
      navigate('/grievances');
    } catch (error) {
      console.error('LLM analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('API key not provided')) {
        toast({ 
          title: 'API Key Required', 
          description: 'Please configure your Gemini API key in Settings or set VITE_GEMINI_API_KEY in .env', 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Analysis failed', 
          description: 'Please check your API key configuration and try again', 
          variant: 'destructive' 
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" asChild className="mb-4"><Link to="/grievances"><ArrowLeft className="h-4 w-4 mr-2"/>Back to My Grievances</Link></Button>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">File a Public Grievance</h1>
          <p className="text-muted-foreground">Submit a complaint to an authority with escalation options.</p>
        </div>
        <form onSubmit={onSubmit}>
          <Card className="mb-6 border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Grievance Details</CardTitle>
              <CardDescription>Fill in the required information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => onChange('category', v)}>
                    <SelectTrigger className={`${errors.category ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto-detect-category" className="font-medium text-blue-600 dark:text-blue-400">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4" />
                          Auto Detect
                        </div>
                      </SelectItem>
                      {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.category && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4"/>{errors.category}</p>)}
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={form.departmentId} onValueChange={(v) => onChange('departmentId', v)}>
                    <SelectTrigger className={`${errors.departmentId ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto-detect-department" className="font-medium text-blue-600 dark:text-blue-400">
                        <div className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4" />
                          Auto Detect
                        </div>
                      </SelectItem>
                      {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4"/>{errors.departmentId}</p>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Authority</Label>
                <Select value={form.authorityId} onValueChange={(v) => onChange('authorityId', v)}>
                  <SelectTrigger className={`${errors.authorityId ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select authority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto-detect-authority" className="font-medium text-blue-600 dark:text-blue-400">
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Auto Detect
                      </div>
                    </SelectItem>
                    {availableAuthorities.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.authorityId && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4"/>{errors.authorityId}</p>)}
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => onChange('subject', e.target.value)} placeholder="Short summary" className={`${errors.subject ? 'border-destructive' : ''}`}/>
                {errors.subject && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4"/>{errors.subject}</p>)}
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Detailed description" className={`${errors.description ? 'border-destructive' : ''}`}/>
                {errors.description && (<p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4"/>{errors.description}</p>)}
              </div>

              <div className="space-y-2">
                <Label>Desired Outcome</Label>
                <Textarea value={form.desiredOutcome} onChange={(e) => onChange('desiredOutcome', e.target.value)} placeholder="What would you consider a satisfactory resolution?"/>
              </div>
              
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2"><Paperclip className="h-4 w-4 mr-2"/>Choose Files</Button>
                  <input ref={fileInputRef} type="file" multiple onChange={onFiles} className="hidden" />
                  {attachments.length > 0 && (<p className="text-sm text-muted-foreground">{attachments.length} file(s) selected</p>)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.shareContact} onCheckedChange={(v) => onChange('shareContact', v)} />
                <span className="text-sm">Allow sharing my contact details with the authority</span>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/grievances')} disabled={isAnalyzing}>Cancel</Button>
            <Button type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing & Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Grievance
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
