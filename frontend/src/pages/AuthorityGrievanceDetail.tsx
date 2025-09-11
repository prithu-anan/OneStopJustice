import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GrievanceEvent } from '@/lib/grievance';
import { ArrowLeft } from 'lucide-react';

export default function AuthorityGrievanceDetail() {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { grievances, authorities, rules, seedDemoData, requestInfo, resolve } = useGrievanceStore();
  const [note, setNote] = useState('');
  const [forwardTo, setForwardTo] = useState<string | undefined>(undefined);
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || (user.role !== 'AUTHORITY_HANDLER' && user.role !== 'AUTHORITY_ADMIN')) navigate('/login');
  }, [isAuthenticated, user, navigate]);
  const g = useMemo(() => grievances.find((x) => x.id === grievanceId), [grievances, grievanceId]);
  if (!g) return null;

  const canAct = user && (user.role === 'AUTHORITY_HANDLER' || user.role === 'AUTHORITY_ADMIN');
  const sameOffice = user?.role === 'AUTHORITY_HANDLER' ? user.authorityId === g.authorityId : true;
  const officePeers = authorities.filter((a) => a.departmentId === g.departmentId);

  const doRequestInfo = () => {
    if (!user || !canAct || !sameOffice) return;
    const ev: GrievanceEvent = { type: 'REQUEST_INFO', at: new Date().toISOString(), byRole: user.role, byId: user.id, note };
    requestInfo(g.id, ev);
    setNote('');
  };
  const doResolve = () => {
    if (!user || !canAct) return;
    const ev: GrievanceEvent = { type: 'RESOLVE', at: new Date().toISOString(), byRole: user.role, byId: user.id, note };
    resolve(g.id, ev);
    setNote('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" asChild className="mb-4"><Link to="/authority/dashboard"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Link></Button>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{g.subject}</h1>
          <Badge>{g.status}</Badge>
        </div>
        <Card className="mb-4"><CardContent className="py-4 whitespace-pre-wrap">{g.description}</CardContent></Card>
        <Card className="mb-6">
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Add note" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={doRequestInfo} disabled={!note.trim()}>Request Info</Button>
              <Button variant="outline" onClick={doResolve}>Resolve</Button>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Forward (simulated)</div>
              <Select value={forwardTo} onValueChange={setForwardTo as any}>
                <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                <SelectContent>
                  {officePeers.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">Forward action is illustrative; demo keeps same authority</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {g.history.map((ev, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium">{ev.type}</span> • {new Date(ev.at).toLocaleString()} {ev.note ? `• ${ev.note}` : ''}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


