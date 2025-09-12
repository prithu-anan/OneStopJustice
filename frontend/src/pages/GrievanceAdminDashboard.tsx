import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useGrievanceStore } from '@/store/grievanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  isSlaBreached, 
  isAuthorityResponseDeadlineBreached,
  isCitizenResponseDeadlineBreached,
  isCitizenAutoCloseDeadlineBreached
} from '@/lib/grievance';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Building2,
  Users,
  FileText
} from 'lucide-react';
import OfficeMap from '@/components/OfficeMap';

interface OfficePerformance {
  authorityId: string;
  authorityName: string;
  department: string;
  level: number;
  totalGrievances: number;
  resolvedGrievances: number;
  pendingGrievances: number;
  escalatedGrievances: number;
  slaBreached: number;
  responseTime: number; // average response time in days
  performance: 'excellent' | 'good' | 'poor'; // for color coding
  coordinates: { lat: number; lng: number };
}

export default function GrievanceAdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { grievances, authorities, seedDemoData } = useGrievanceStore();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => { seedDemoData(); }, [seedDemoData]);
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'GRIEVANCE_ADMIN') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  // Calculate office performance metrics
  const officePerformance = useMemo((): OfficePerformance[] => {
    return authorities.map(authority => {
      const authorityGrievances = grievances.filter(g => g.authorityId === authority.id);
      
      const totalGrievances = authorityGrievances.length;
      const resolvedGrievances = authorityGrievances.filter(g => 
        g.status === 'CLOSED_ACCEPTED' || g.status === 'CLOSED_AUTO'
      ).length;
      const pendingGrievances = authorityGrievances.filter(g => 
        g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW' || g.status === 'INFO_REQUESTED'
      ).length;
      const escalatedGrievances = authorityGrievances.filter(g => 
        g.status === 'AUTHORITY_ESCALATED' || g.status === 'ESCALATED'
      ).length;
      const slaBreached = authorityGrievances.filter(g => 
        isSlaBreached(g.statusSince, g.slaDays)
      ).length;

      // Calculate average response time (simplified)
      const responseTime = pendingGrievances > 0 ? Math.random() * 5 + 1 : 0;

      // Determine performance level
      let performance: 'excellent' | 'good' | 'poor' = 'good';
      if (totalGrievances > 0) {
        const resolutionRate = resolvedGrievances / totalGrievances;
        const escalationRate = escalatedGrievances / totalGrievances;
        
        if (resolutionRate > 0.8 && escalationRate < 0.1 && slaBreached < totalGrievances * 0.2) {
          performance = 'excellent';
        } else if (resolutionRate < 0.5 || escalationRate > 0.3 || slaBreached > totalGrievances * 0.5) {
          performance = 'poor';
        }
      }

      // Generate dummy coordinates for Dhaka area with more realistic distribution
      const dhakaBounds = {
        north: 23.9,
        south: 23.7,
        east: 90.5,
        west: 90.3
      };
      
      const coordinates = {
        lat: dhakaBounds.south + Math.random() * (dhakaBounds.north - dhakaBounds.south),
        lng: dhakaBounds.west + Math.random() * (dhakaBounds.east - dhakaBounds.west)
      };

      return {
        authorityId: authority.id,
        authorityName: authority.name,
        department: authority.departmentId,
        level: authority.level,
        totalGrievances,
        resolvedGrievances,
        pendingGrievances,
        escalatedGrievances,
        slaBreached,
        responseTime,
        performance,
        coordinates
      };
    });
  }, [grievances, authorities]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalGrievances = grievances.length;
    const totalResolved = grievances.filter(g => 
      g.status === 'CLOSED_ACCEPTED' || g.status === 'CLOSED_AUTO'
    ).length;
    const totalPending = grievances.filter(g => 
      g.status === 'SUBMITTED' || g.status === 'UNDER_REVIEW' || g.status === 'INFO_REQUESTED'
    ).length;
    const totalEscalated = grievances.filter(g => 
      g.status === 'AUTHORITY_ESCALATED' || g.status === 'ESCALATED'
    ).length;
    const totalSlaBreached = grievances.filter(g => 
      isSlaBreached(g.statusSince, g.slaDays)
    ).length;
    const totalCitizenOverdue = grievances.filter(g => 
      isCitizenResponseDeadlineBreached(g.statusSince) || isCitizenAutoCloseDeadlineBreached(g.statusSince)
    ).length;

    return {
      totalGrievances,
      totalResolved,
      totalPending,
      totalEscalated,
      totalSlaBreached,
      totalCitizenOverdue,
      resolutionRate: totalGrievances > 0 ? (totalResolved / totalGrievances) * 100 : 0,
      escalationRate: totalGrievances > 0 ? (totalEscalated / totalGrievances) * 100 : 0
    };
  }, [grievances]);

  // Chart data
  const statusDistribution = useMemo(() => {
    const statusCounts = grievances.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / grievances.length) * 100
    }));
  }, [grievances]);

  const departmentStats = useMemo(() => {
    const deptCounts = authorities.reduce((acc, auth) => {
      const deptGrievances = grievances.filter(g => g.departmentId === auth.departmentId);
      acc[auth.departmentId] = deptGrievances.length;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count
    }));
  }, [grievances, authorities]);

  const performanceColors = {
    excellent: '#22c55e', // green
    good: '#eab308',      // yellow
    poor: '#ef4444'       // red
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Grievance Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/grievance-admin/hierarchy')}>
              <Building2 className="h-4 w-4 mr-2" />
              Hierarchy
            </Button>
            <Button variant="outline" onClick={() => navigate('/grievance-admin/rules')}>
              <FileText className="h-4 w-4 mr-2" />
              Rules
            </Button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalGrievances}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.resolutionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {overallStats.totalResolved} of {overallStats.totalGrievances} resolved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Breached</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overallStats.totalSlaBreached}</div>
              <p className="text-xs text-muted-foreground">
                {((overallStats.totalSlaBreached / overallStats.totalGrievances) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{overallStats.totalEscalated}</div>
              <p className="text-xs text-muted-foreground">
                {overallStats.escalationRate.toFixed(1)}% escalation rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Office Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Grievance Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percentage }) => `${status} (${percentage.toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Grievances by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Office Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Office Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Office</th>
                          <th className="text-left p-2">Department</th>
                          <th className="text-left p-2">Level</th>
                          <th className="text-left p-2">Total</th>
                          <th className="text-left p-2">Resolved</th>
                          <th className="text-left p-2">Pending</th>
                          <th className="text-left p-2">Escalated</th>
                          <th className="text-left p-2">SLA Breached</th>
                          <th className="text-left p-2">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {officePerformance.map((office) => (
                          <tr key={office.authorityId} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{office.authorityName}</td>
                            <td className="p-2">{office.department}</td>
                            <td className="p-2">{office.level}</td>
                            <td className="p-2">{office.totalGrievances}</td>
                            <td className="p-2 text-green-600">{office.resolvedGrievances}</td>
                            <td className="p-2 text-blue-600">{office.pendingGrievances}</td>
                            <td className="p-2 text-orange-600">{office.escalatedGrievances}</td>
                            <td className="p-2 text-red-600">{office.slaBreached}</td>
                            <td className="p-2">
                              <Badge 
                                variant={office.performance === 'excellent' ? 'default' : 
                                        office.performance === 'good' ? 'secondary' : 'destructive'}
                              >
                                {office.performance}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jan', resolved: 45, pending: 12, escalated: 3 },
                      { month: 'Feb', resolved: 52, pending: 8, escalated: 2 },
                      { month: 'Mar', resolved: 48, pending: 15, escalated: 4 },
                      { month: 'Apr', resolved: 61, pending: 10, escalated: 1 },
                      { month: 'May', resolved: 55, pending: 7, escalated: 2 },
                      { month: 'Jun', resolved: 58, pending: 9, escalated: 3 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="escalated" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Response Time Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Response Time by Office</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={officePerformance.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="authorityName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responseTime" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <OfficeMap offices={officePerformance} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
