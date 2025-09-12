import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EscalationRules() {
  const { user, isAuthenticated } = useAuthStore();
  const { rules, seedDemoData } = useGrievanceStore();
  const navigate = useNavigate();
  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'GRIEVANCE_ADMIN') navigate('/login');
  }, [isAuthenticated, user, navigate]);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Escalation Rules</h1>
        <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
          <CardHeader><CardTitle>Configured Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div key={r.id} className="text-sm">
                <div className="font-medium">{r.name}</div>
                <div>Category: {r.category} • Dept: {r.departmentId}</div>
                <div>Levels: {r.levels.join(' → ')}</div>
                <div>SLA(days): {r.slaDaysPerLevel.join(', ')} • Citizen response: {r.citizenResponseDays} days</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


