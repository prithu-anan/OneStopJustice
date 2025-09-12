import { useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isSlaBreached, isAuthorityResponseDeadlineBreached, daysUntilAuthorityResponseDeadline } from '@/lib/grievance';

export default function AuthorityDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { grievances, authorities, seedDemoData } = useGrievanceStore();
  const navigate = useNavigate();
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || (user.role !== 'AUTHORITY_HANDLER' && user.role !== 'AUTHORITY_ADMIN')) navigate('/login');
  }, [isAuthenticated, user, navigate]);

  const myAuthorityIds = useMemo(() => {
    if (!user) return [] as string[];
    if (user.role === 'AUTHORITY_ADMIN') return user.managedAuthorityIds || [];
    if (user.role === 'AUTHORITY_HANDLER') return user.authorityId ? [user.authorityId] : [];
    return [];
  }, [user]);

  // Authority Admin only sees escalated grievances (AUTHORITY_ESCALATED status)
  // Authority Handler sees all grievances assigned to their office (except escalated ones)
  const items = grievances.filter((g) => {
    if (!myAuthorityIds.includes(g.authorityId)) return false;
    if (g.status === 'ARCHIVED' || g.status === 'CLOSED_NO_RESPONSE') return false;
    
    if (user?.role === 'AUTHORITY_ADMIN') {
      // Admin only sees escalated grievances
      return g.status === 'AUTHORITY_ESCALATED';
    } else if (user?.role === 'AUTHORITY_HANDLER') {
      // Handler sees all grievances except escalated ones
      return g.status !== 'AUTHORITY_ESCALATED';
    }
    
    return false;
  });
  const breaching = items.filter((g) => isSlaBreached(g.statusSince, g.slaDays));
  
  // Authority response deadline breaches
  const authorityDeadlineBreaches = items.filter((g) => 
    user?.role === 'AUTHORITY_HANDLER' && 
    (g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW') &&
    isAuthorityResponseDeadlineBreached(g.statusSince)
  );

  const getAuthorityName = (id: string) => authorities.find((a) => a.id === id)?.name || id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">
          {user?.role === 'AUTHORITY_ADMIN' ? 'Authority Admin Dashboard' : 'Authority Handler Dashboard'}
        </h1>
        {user?.role === 'AUTHORITY_ADMIN' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Admin View: Only escalated grievances are shown here</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              These are cases that were escalated from authority handlers who failed to respond within 3 days.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader><CardTitle>{user?.role === 'AUTHORITY_ADMIN' ? 'Escalated' : 'Total'}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{items.length}</CardContent>
          </Card>
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader><CardTitle>SLA Breached</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{breaching.length}</CardContent>
          </Card>
          {user?.role === 'AUTHORITY_HANDLER' && (
            <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
              <CardHeader><CardTitle>Response Overdue</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold text-red-600">{authorityDeadlineBreaches.length}</CardContent>
            </Card>
          )}
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader><CardTitle>Open</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{items.filter((g) => g.status !== 'CLOSED_ACCEPTED' && g.status !== 'WITHDRAWN').length}</CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((g) => {
            const authorityDeadlineBreached = user?.role === 'AUTHORITY_HANDLER' && 
              (g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW') &&
              isAuthorityResponseDeadlineBreached(g.statusSince);
            const daysUntilAuthorityDeadline = daysUntilAuthorityResponseDeadline(g.statusSince);
            
            return (
              <Card key={g.id} className={`bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm hover:shadow ${authorityDeadlineBreached ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{g.subject}</span>
                    <Badge variant={authorityDeadlineBreached ? 'destructive' : 'secondary'}>{g.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground line-clamp-2">{g.description}</div>
                  <div className="text-xs text-muted-foreground">Authority: {getAuthorityName(g.authorityId)}</div>
                  
                  {/* Role-specific information */}
                  {user?.role === 'AUTHORITY_ADMIN' && g.status === 'AUTHORITY_ESCALATED' && (
                    <div className="text-xs text-orange-600 font-medium">
                      Escalated from handler - requires admin attention
                    </div>
                  )}
                  
                  {/* Authority response deadline warning for handlers */}
                  {user?.role === 'AUTHORITY_HANDLER' && (g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW') && (
                    <div className="text-xs">
                      {authorityDeadlineBreached ? (
                        <span className="text-red-600 font-medium">Response overdue - escalation required</span>
                      ) : (
                        <span className="text-blue-600">
                          Response needed in {daysUntilAuthorityDeadline} days
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-2"><Button size="sm" asChild><Link to={`/authority/grievances/${g.id}`}>Open</Link></Button></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}


