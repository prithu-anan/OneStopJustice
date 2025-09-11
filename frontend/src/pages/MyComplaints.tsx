import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Calendar,
  User,
  Badge as BadgeIcon,
  Plus,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import api, { isAuthenticated } from '@/lib/api';
import debugAPI from '@/lib/debug';

interface Attachment {
  fileName: string;
  ipfsHash: string;
  uploadedAt: string;
}

interface AssignedOfficer {
  id: string;
  name: string;
  rank: string;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  area: string;
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'FIR_REGISTERED' | 'CASE_FILED' | 'CLOSED';
  assignedOfficerIds: AssignedOfficer[];
  attachments: Attachment[];
  createdAt: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700',
    icon: Clock
  },
  UNDER_INVESTIGATION: {
    label: 'Under Investigation',
    color: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30',
    icon: AlertCircle
  },
  FIR_REGISTERED: {
    label: 'FIR Registered',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700',
    icon: FileText
  },
  CASE_FILED: {
    label: 'Case Filed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700',
    icon: BadgeIcon
  },
  CLOSED: {
    label: 'Closed',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
    icon: CheckCircle
  }
};

export const MyComplaints = () => {
  const { user, token } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Check authentication before making API calls
    if (!isAuthenticated() || !user || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your complaints",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Only allow citizens to access this page
    if (user.role !== 'CITIZEN') {
      toast({
        title: "Access Denied",
        description: "This page is only accessible to citizens",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    fetchComplaints();
  }, [user, token, navigate]);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      
      // Debug current auth state
      debugAPI.checkAuth();
      
      // Double-check authentication before API call
      if (!isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      console.log('Fetching complaints with token:', token ? 'Present' : 'Missing');
      console.log('User role:', user?.role);
      console.log('API Base URL:', api.defaults.baseURL);
      
      const response = await api.get('/citizens/complaints');
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setComplaints(response.data.data || []);
        toast({
          title: "Success",
          description: `Loaded ${response.data.data?.length || 0} complaints`,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch complaints');
      }
    } catch (error: any) {
      console.error('Error fetching complaints:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to access your complaints",
          variant: "destructive",
        });
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view complaints",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to fetch complaints",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadAttachment = (attachment: Attachment) => {
    // Implement IPFS download logic here
    toast({
      title: "Download",
      description: `Downloading ${attachment.fileName}...`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Complaints</h1>
              <p className="text-muted-foreground mt-2">
                Track and manage all your filed complaints
              </p>
              {user && (
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Logged in as: {user.name} ({user.nid})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchComplaints}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/file-complaint">
                  <Plus className="h-4 w-4 mr-2" />
                  File New Complaint
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 hover:shadow-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                  <p className="text-2xl font-bold text-foreground">{complaints.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 hover:shadow-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Investigation</p>
                  <p className="text-2xl font-bold text-foreground">
                    {complaints.filter(c => c.status === 'UNDER_INVESTIGATION').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 hover:shadow-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Closed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {complaints.filter(c => c.status === 'CLOSED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 hover:shadow-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {complaints.filter(c => c.status === 'PENDING').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-danger" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints by title, description, or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border focus:ring-primary"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground appearance-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_INVESTIGATION">Under Investigation</option>
                    <option value="FIR_REGISTERED">FIR Registered</option>
                    <option value="CASE_FILED">Case Filed</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <Card className="border border-primary/20 dark:border-primary/30 shadow-lg bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {complaints.length === 0 ? 'No complaints filed yet' : 'No complaints match your search'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {complaints.length === 0 
                  ? 'Start by filing your first complaint to seek justice.'
                  : 'Try adjusting your search terms or filters.'
                }
              </p>
              {complaints.length === 0 && (
                <Button asChild className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/file-complaint">
                    <Plus className="h-4 w-4 mr-2" />
                    File Your First Complaint
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => {
              const statusInfo = statusConfig[complaint.status];
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={complaint._id} className="border border-primary/20 dark:border-primary/30 shadow-lg hover:shadow-xl hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-foreground">{complaint.title}</CardTitle>
                          <Badge className={`${statusInfo.color} border font-medium px-3 py-1`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <CardDescription className="text-muted-foreground text-base">
                          {complaint.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild className="border-primary/20 text-primary hover:bg-primary/10">
                        <Link 
                          to={`/complaints/${complaint._id}`}
                          onClick={() => {
                            console.log('Navigating to complaint detail with ID:', complaint._id);
                            console.log('Full complaint object:', complaint);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Filed: {formatDate(complaint.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BadgeIcon className="h-4 w-4" />
                        <span>Area: {complaint.area}</span>
                      </div>
                      
                      {complaint.assignedOfficerIds.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>
                            Officer: {complaint.assignedOfficerIds[0].name} ({complaint.assignedOfficerIds[0].rank})
                          </span>
                        </div>
                      )}
                    </div>

                    {complaint.attachments.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Attachments ({complaint.attachments.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {complaint.attachments.map((attachment, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => downloadAttachment(attachment)}
                                className="text-xs border-primary/20 text-primary hover:bg-primary/10"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {attachment.fileName}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
