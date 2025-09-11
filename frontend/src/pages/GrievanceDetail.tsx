import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useGrievanceStore } from '@/store/grievanceStore';
import { useAuthStore } from '@/store/authStore';
import { daysRemaining, isSlaBreached, GrievanceEvent } from '@/lib/grievance';
import { ArrowLeft } from 'lucide-react';

export default function GrievanceDetail() {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { grievances, authorities, rules, seedDemoData, provideInfo, escalate, accept, dispute } = useGrievanceStore();
  const [replyNote, setReplyNote] = useState('');
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  const g = useMemo(() => grievances.find((x) => x.id === grievanceId), [grievances, grievanceId]);
  const rule = useMemo(() => rules.find((r) => r.category === g?.category && r.departmentId === g?.departmentId), [rules, g]);
  const currentAuthorityName = useMemo(() => authorities.find((a) => a.id === g?.authorityId)?.name || g?.authorityId, [authorities, g]);
  if (!g) return null;
  const breached = isSlaBreached(g.statusSince, g.slaDays);
  const remaining = daysRemaining(g.statusSince, g.slaDays);

  const canProvideInfo = g.status === 'INFO_REQUESTED' && user?.role === 'CITIZEN' && user.id === g.citizenId;
  const canEscalate = breached && user?.role === 'CITIZEN' && user.id === g.citizenId;
  const canAccept = g.status === 'RESOLVED_PENDING_CONFIRM' && user?.role === 'CITIZEN' && user.id === g.citizenId;

  const nextAuthorityId = (() => {
    if (!rule) return undefined;
    const idx = rule.levels.indexOf(g.authorityId);
    return rule.levels[idx + 1];
  })();

  const submitProvideInfo = () => {
    if (!user) return;
    const event: GrievanceEvent = { type: 'INFO_PROVIDED', at: new Date().toISOString(), byRole: 'CITIZEN', byId: user.id, note: replyNote };
    provideInfo(g.id, event);
    setReplyNote('');
  };

  const submitEscalate = () => {
    if (!user || !nextAuthorityId) return;
    const event: GrievanceEvent = { type: 'ESCALATE', at: new Date().toISOString(), byRole: 'CITIZEN', byId: user.id, note: 'Escalated by citizen', toAuthorityId: nextAuthorityId };
    escalate(g.id, event);
  };

  const submitAccept = () => {
    if (!user) return;
    const event: GrievanceEvent = { type: 'ACCEPT', at: new Date().toISOString(), byRole: 'CITIZEN', byId: user.id };
    accept(g.id, event);
  };

  const submitDispute = () => {
    if (!user) return;
    const event: GrievanceEvent = { type: 'DISPUTE', at: new Date().toISOString(), byRole: 'CITIZEN', byId: user.id, note: replyNote };
    dispute(g.id, event);
    setReplyNote('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" asChild className="mb-4"><Link to="/grievances"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Link></Button>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{g.subject}</h1>
          <Badge>{g.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-4">Authority: {currentAuthorityName} • SLA: {breached ? 'Breached' : `${remaining} day(s) left`}</div>
        <Card className="mb-4 border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm"><CardContent className="py-4 whitespace-pre-wrap">{g.description}</CardContent></Card>
        <Card className="mb-6 border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {g.history.map((ev, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">{ev.type}</span> • {new Date(ev.at).toLocaleString()} {ev.note ? `• ${ev.note}` : ''}
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3">
          {canProvideInfo && (
            <Card className="border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
              <CardHeader><CardTitle>Provide requested information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Textarea placeholder="Add details..." value={replyNote} onChange={(e) => setReplyNote(e.target.value)} />
                <Button onClick={submitProvideInfo} disabled={!replyNote.trim()}>Send</Button>
              </CardContent>
            </Card>
          )}
          {canAccept && (
            <div className="flex gap-2">
              <Button onClick={submitAccept}>Accept Resolution</Button>
              <Button variant="outline" onClick={submitDispute}>Dispute</Button>
            </div>
          )}
          {canEscalate && nextAuthorityId && (
            <div>
              <Button onClick={submitEscalate}>Escalate to next authority</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}


