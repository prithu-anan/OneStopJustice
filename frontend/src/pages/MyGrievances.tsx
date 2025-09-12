import { useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  daysRemaining, 
  isSlaBreached, 
  isCitizenResponseDeadlineBreached,
  isCitizenAutoCloseDeadlineBreached,
  daysUntilCitizenResponseDeadline,
  daysUntilCitizenAutoClose
} from '@/lib/grievance';

export default function MyGrievances() {
  const { user, isAuthenticated } = useAuthStore();
  const { grievances, seedDemoData, authorities, rules } = useGrievanceStore();
  const navigate = useNavigate();
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'CITIZEN') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  const my = useMemo(() => grievances.filter((g) => g.citizenId === user?.id), [grievances, user]);

  const getAuthorityName = (id: string) => authorities.find((a) => a.id === id)?.name || id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Grievances</h1>
          <Button asChild><Link to="/file-grievance">File New</Link></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {my.map((g) => {
            const breached = isSlaBreached(g.statusSince, g.slaDays);
            const remaining = daysRemaining(g.statusSince, g.slaDays);
            
            // Citizen response deadline checks
            const citizenResponseBreached = isCitizenResponseDeadlineBreached(g.statusSince);
            const citizenAutoCloseBreached = isCitizenAutoCloseDeadlineBreached(g.statusSince);
            const daysUntilResponseDeadline = daysUntilCitizenResponseDeadline(g.statusSince);
            const daysUntilAutoClose = daysUntilCitizenAutoClose(g.statusSince);
            
            // Determine badge color based on status and deadlines
            const getBadgeVariant = () => {
              if (g.status === 'CLOSED_NO_RESPONSE' || g.status === 'ARCHIVED') return 'secondary';
              if (citizenAutoCloseBreached) return 'destructive';
              if (citizenResponseBreached) return 'destructive';
              if (breached) return 'destructive';
              return 'secondary';
            };
            
            return (
              <Card key={g.id} className="hover:shadow-md transition-shadow border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{g.subject}</span>
                    <Badge variant={getBadgeVariant()}>{g.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                  <div className="text-xs text-muted-foreground">Authority: {getAuthorityName(g.authorityId)}</div>
                  <div className="text-xs">SLA: {breached ? 'Breached' : `${remaining} day(s) remaining`}</div>
                  
                  {/* Citizen response deadline info */}
                  {(g.status === 'INFO_REQUESTED' || g.status === 'RESOLVED_PENDING_CONFIRM') && (
                    <div className="text-xs">
                      {citizenAutoCloseBreached ? (
                        <span className="text-red-600 font-medium">Auto-closed - no response</span>
                      ) : citizenResponseBreached ? (
                        <span className="text-orange-600 font-medium">
                          Response overdue - {daysUntilAutoClose} days until auto-close
                        </span>
                      ) : (
                        <span className="text-blue-600">
                          Response needed in {daysUntilResponseDeadline} days
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild><Link to={`/grievances/${g.id}`}>View</Link></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {my.length === 0 && (
          <Card className="mt-8 border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm"><CardContent className="py-8 text-center text-muted-foreground">No grievances yet.</CardContent></Card>
        )}
      </div>
    </Layout>
  );
}


