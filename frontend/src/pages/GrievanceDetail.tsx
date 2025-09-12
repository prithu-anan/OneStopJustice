import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useGrievanceStore } from '@/store/grievanceStore';
import { useAuthStore } from '@/store/authStore';
import { 
  daysRemaining, 
  isSlaBreached, 
  GrievanceEvent,
  isCitizenResponseDeadlineBreached,
  isCitizenAutoCloseDeadlineBreached,
  daysUntilCitizenResponseDeadline,
  daysUntilCitizenAutoClose
} from '@/lib/grievance';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';

export default function GrievanceDetail() {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { grievances, authorities, rules, seedDemoData, provideInfo, escalate, accept, dispute } = useGrievanceStore();
  const [replyNote, setReplyNote] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  const g = useMemo(() => grievances.find((x) => x.id === grievanceId), [grievances, grievanceId]);
  const rule = useMemo(() => rules.find((r) => r.category === g?.category && r.departmentId === g?.departmentId), [rules, g]);
  const currentAuthorityName = useMemo(() => authorities.find((a) => a.id === g?.authorityId)?.name || g?.authorityId, [authorities, g]);
  if (!g) return null;
  const breached = isSlaBreached(g.statusSince, g.slaDays);
  const remaining = daysRemaining(g.statusSince, g.slaDays);

  // Citizen response deadline checks
  const citizenResponseBreached = isCitizenResponseDeadlineBreached(g.statusSince);
  const citizenAutoCloseBreached = isCitizenAutoCloseDeadlineBreached(g.statusSince);
  const daysUntilResponseDeadline = daysUntilCitizenResponseDeadline(g.statusSince);
  const daysUntilAutoClose = daysUntilCitizenAutoClose(g.statusSince);

  // Check if grievance should be auto-closed
  const shouldAutoClose = (g.status === 'INFO_REQUESTED' || g.status === 'RESOLVED_PENDING_CONFIRM') 
    && citizenAutoCloseBreached && user?.role === 'CITIZEN' && user.id === g.citizenId;

  const canProvideInfo = g.status === 'INFO_REQUESTED' && user?.role === 'CITIZEN' && user.id === g.citizenId && !citizenAutoCloseBreached;
  const canEscalate = breached && user?.role === 'CITIZEN' && user.id === g.citizenId;
  const canAccept = g.status === 'RESOLVED_PENDING_CONFIRM' && user?.role === 'CITIZEN' && user.id === g.citizenId && !citizenAutoCloseBreached;

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
    if (!user || !disputeReason.trim()) return;
    const event: GrievanceEvent = { type: 'DISPUTE', at: new Date().toISOString(), byRole: 'CITIZEN', byId: user.id, note: disputeReason.trim() };
    dispute(g.id, event);
    setDisputeReason('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" asChild className="mb-4"><Link to="/grievances"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Link></Button>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{g.subject}</h1>
          <Badge>{g.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Authority: {currentAuthorityName} • SLA: {breached ? 'Breached' : `${remaining} day(s) left`}
          {(g.status === 'INFO_REQUESTED' || g.status === 'RESOLVED_PENDING_CONFIRM') && user?.role === 'CITIZEN' && user.id === g.citizenId && (
            <span className="ml-4">
              {citizenAutoCloseBreached ? (
                <span className="text-red-600 font-medium">Auto-closed due to no response</span>
              ) : citizenResponseBreached ? (
                <span className="text-orange-600 font-medium">Response deadline passed - {daysUntilAutoClose} days until auto-close</span>
              ) : (
                <span className="text-blue-600">Response required in {daysUntilResponseDeadline} days</span>
              )}
            </span>
          )}
        </div>
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
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={submitAccept}>Accept Resolution</Button>
                <Button variant="outline" onClick={submitDispute} disabled={!disputeReason.trim()}>Dispute</Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dispute Reasoning (Required)</label>
                <Textarea 
                  placeholder="Please explain why you dispute this resolution..." 
                  value={disputeReason} 
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          {canEscalate && nextAuthorityId && (
            <div>
              <Button onClick={submitEscalate}>Escalate to next authority</Button>
            </div>
          )}
          {shouldAutoClose && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">This grievance has been auto-closed</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  No response was provided within 15 days. The grievance is now closed and will be archived.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}


