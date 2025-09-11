import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function HierarchyManager() {
  const { user, isAuthenticated } = useAuthStore();
  const { authorities, seedDemoData } = useGrievanceStore();
  const navigate = useNavigate();
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'GRIEVANCE_ADMIN') navigate('/login');
  }, [isAuthenticated, user, navigate]);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Hierarchy Manager</h1>
        <Card>
          <CardHeader><CardTitle>Authorities</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {authorities.map((a) => (
              <div key={a.id} className="text-sm">{a.name} • Level {a.level} • Dept {a.departmentId} {a.parentId ? `• Parent ${a.parentId}` : ''}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


