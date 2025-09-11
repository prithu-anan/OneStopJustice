import { useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isSlaBreached } from '@/lib/grievance';

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

  const items = grievances.filter((g) => myAuthorityIds.includes(g.authorityId));
  const breaching = items.filter((g) => isSlaBreached(g.statusSince, g.slaDays));

  const getAuthorityName = (id: string) => authorities.find((a) => a.id === id)?.name || id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Authority Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{items.length}</CardContent></Card>
          <Card><CardHeader><CardTitle>Breached</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{breaching.length}</CardContent></Card>
          <Card><CardHeader><CardTitle>Open</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{items.filter((g) => g.status !== 'CLOSED_ACCEPTED' && g.status !== 'WITHDRAWN').length}</CardContent></Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((g) => (
            <Card key={g.id} className="hover:shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{g.subject}</span>
                  <Badge>{g.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground line-clamp-2">{g.description}</div>
                <div className="text-xs text-muted-foreground">Authority: {getAuthorityName(g.authorityId)}</div>
                <div className="pt-2"><Button size="sm" asChild><Link to={`/authority/grievances/${g.id}`}>Open</Link></Button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}


