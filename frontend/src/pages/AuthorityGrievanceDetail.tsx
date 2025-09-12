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
import { GrievanceEvent, isAuthorityResponseDeadlineBreached, daysUntilAuthorityResponseDeadline } from '@/lib/grievance';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';

export default function AuthorityGrievanceDetail() {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { grievances, authorities, rules, seedDemoData, requestInfo, resolve, forward, authorityEscalate } = useGrievanceStore();
  const [note, setNote] = useState('');
  const [forwardTo, setForwardTo] = useState<string | undefined>(undefined);
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || (user.role !== 'AUTHORITY_HANDLER' && user.role !== 'AUTHORITY_ADMIN')) navigate('/login');
  }, [isAuthenticated, user, navigate]);
  const g = useMemo(() => grievances.find((x) => x.id === grievanceId), [grievances, grievanceId]);
  if (!g) return null;

  // Authority response deadline checks
  const authorityResponseBreached = isAuthorityResponseDeadlineBreached(g.statusSince);
  const daysUntilAuthorityDeadline = daysUntilAuthorityResponseDeadline(g.statusSince);

  const canAct = user && (user.role === 'AUTHORITY_HANDLER' || user.role === 'AUTHORITY_ADMIN');
  const sameOffice = user?.role === 'AUTHORITY_HANDLER' ? user.authorityId === g.authorityId : true;
  
  // Authority Admin can only act on escalated grievances
  // Authority Handler can act on all grievances in their office (except escalated ones)
  const canActOnThisGrievance = user?.role === 'AUTHORITY_ADMIN' 
    ? g.status === 'AUTHORITY_ESCALATED' 
    : user?.role === 'AUTHORITY_HANDLER' && g.status !== 'AUTHORITY_ESCALATED' && sameOffice;
  const officePeers = authorities.filter((a) => a.departmentId === g.departmentId);
  
  // Check if this should be escalated to admin due to handler timeout
  const shouldEscalateToAdmin = user?.role === 'AUTHORITY_HANDLER' && 
    authorityResponseBreached && 
    (g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW') &&
    sameOffice;

  const doRequestInfo = () => {
    if (!user || !canActOnThisGrievance) return;
    const ev: GrievanceEvent = { type: 'REQUEST_INFO', at: new Date().toISOString(), byRole: user.role, byId: user.id, note };
    requestInfo(g.id, ev);
    setNote('');
  };
  const doResolve = () => {
    if (!user || !canActOnThisGrievance) return;
    const ev: GrievanceEvent = { type: 'RESOLVE', at: new Date().toISOString(), byRole: user.role, byId: user.id, note };
    resolve(g.id, ev);
    setNote('');
  };

  const doForward = () => {
    if (!user || !canActOnThisGrievance || !forwardTo) return;
    const ev: GrievanceEvent = { 
      type: 'FORWARD', 
      at: new Date().toISOString(), 
      byRole: user.role, 
      byId: user.id, 
      note: note || `Forwarded to ${authorities.find(a => a.id === forwardTo)?.name}`,
      toAuthorityId: forwardTo 
    };
    forward(g.id, ev);
    setNote('');
    setForwardTo(undefined);
  };

  const doEscalateToAdmin = () => {
    if (!user || !shouldEscalateToAdmin) return;
    // Find the admin for this authority
    const adminAuthority = authorities.find(a => a.level > 0 && a.departmentId === g.departmentId);
    if (!adminAuthority) return;
    
    const ev: GrievanceEvent = { 
      type: 'AUTHORITY_ESCALATE', 
      at: new Date().toISOString(), 
      byRole: 'SYSTEM', 
      note: 'Auto-escalated to admin due to handler timeout',
      toAuthorityId: adminAuthority.id 
    };
    authorityEscalate(g.id, ev);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="outline" asChild className="mb-4"><Link to="/authority/dashboard"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Link></Button>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{g.subject}</h1>
          <Badge>{g.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {user?.role === 'AUTHORITY_ADMIN' && g.status === 'AUTHORITY_ESCALATED' && (
            <span className="text-orange-600 font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Escalated case - requires admin attention
            </span>
          )}
          {user?.role === 'AUTHORITY_HANDLER' && (g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW') && (
            <span>
              {authorityResponseBreached ? (
                <span className="text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Response deadline passed - escalation required
                </span>
              ) : (
                <span className="text-blue-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Response required in {daysUntilAuthorityDeadline} days
                </span>
              )}
            </span>
          )}
        </div>
        <Card className="mb-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardContent className="py-4 whitespace-pre-wrap">{g.description}</CardContent>
        </Card>
        <Card className="mb-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {canActOnThisGrievance ? (
              <>
                <Textarea placeholder="Add note" value={note} onChange={(e) => setNote(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={doRequestInfo} disabled={!note.trim()}>Request Info</Button>
                  <Button variant="outline" onClick={doResolve}>Resolve</Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                {user?.role === 'AUTHORITY_ADMIN' && g.status !== 'AUTHORITY_ESCALATED' && (
                  <p>This grievance is not escalated and is being handled by the authority handler.</p>
                )}
                {user?.role === 'AUTHORITY_HANDLER' && g.status === 'AUTHORITY_ESCALATED' && (
                  <p>This grievance has been escalated to the authority admin.</p>
                )}
                {!canActOnThisGrievance && (
                  <p>You do not have permission to act on this grievance.</p>
                )}
              </div>
            )}
            {canActOnThisGrievance && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Forward to another office</div>
                <Select value={forwardTo} onValueChange={setForwardTo as any}>
                  <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                  <SelectContent>
                    {officePeers.filter(a => a.id !== g.authorityId).map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={doForward} 
                  disabled={!forwardTo}
                  className="w-full"
                >
                  Forward Grievance
                </Button>
              </div>
            )}
            {shouldEscalateToAdmin && (
              <div className="border-t pt-3">
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Auto-Escalation Required</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Response deadline has passed. This grievance will be automatically escalated to the department admin.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={doEscalateToAdmin}
                  >
                    Escalate to Admin Now
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
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


