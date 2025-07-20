import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Eye,
  Download,
  Filter
} from "lucide-react";
import { StatusBadge, ServiceStatus } from "@/components/StatusBadge";
import { Header } from "@/components/Header";

interface ServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  serviceCategory: string;
  status: ServiceStatus;
  submittedDate: string;
  amount: number;
  documentCount: number;
}

// Mock data
const mockRequests: ServiceRequest[] = [
  {
    id: "REQ001",
    customerName: "Raj Kumar Singh",
    customerEmail: "raj.singh@email.com",
    customerPhone: "+91 98765 43210",
    serviceTitle: "Aadhar Card Update",
    serviceCategory: "Identity Documents",
    status: "pending",
    submittedDate: "2024-01-15",
    amount: 150,
    documentCount: 4,
  },
  {
    id: "REQ002",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@email.com",
    customerPhone: "+91 87654 32109",
    serviceTitle: "Income Certificate",
    serviceCategory: "Certificates",
    status: "processing",
    submittedDate: "2024-01-14",
    amount: 200,
    documentCount: 6,
  },
  {
    id: "REQ003",
    customerName: "Amit Patel",
    customerEmail: "amit.patel@email.com",
    customerPhone: "+91 76543 21098",
    serviceTitle: "Samagra ID Registration",
    serviceCategory: "Government ID",
    status: "completed",
    submittedDate: "2024-01-12",
    amount: 100,
    documentCount: 5,
  },
  {
    id: "REQ004",
    customerName: "Sunita Verma",
    customerEmail: "sunita.verma@email.com",
    customerPhone: "+91 65432 10987",
    serviceTitle: "Pension Scheme Application",
    serviceCategory: "Social Welfare",
    status: "rejected",
    submittedDate: "2024-01-10",
    amount: 300,
    documentCount: 3,
  },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [requests] = useState<ServiceRequest[]>(mockRequests);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === "pending").length,
      processing: requests.filter(r => r.status === "processing").length,
      completed: requests.filter(r => r.status === "completed").length,
      rejected: requests.filter(r => r.status === "rejected").length,
    };
  };

  const getTotalRevenue = () => {
    return requests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const statusCounts = getStatusCounts();
  const totalRevenue = getTotalRevenue();

  const updateRequestStatus = (requestId: string, newStatus: ServiceStatus) => {
    // In a real app, this would make an API call
    console.log(`Updating request ${requestId} to status ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage service requests and track business performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{statusCounts.pending}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{statusCounts.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From completed services</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>
                  Manage and track all customer service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by customer name, service, or request ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | "all")}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                {/* Requests Table */}
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No requests found matching your criteria
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {request.id}
                                </Badge>
                                <StatusBadge status={request.status} />
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-1">{request.serviceTitle}</h3>
                              <p className="text-muted-foreground text-sm mb-2">{request.serviceCategory}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {request.customerName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {request.documentCount} documents
                                </div>
                                <div>
                                  Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">₹{request.amount}</div>
                                <div className="text-xs text-muted-foreground">Service fee</div>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Documents
                                </Button>
                                
                                {request.status === "pending" && (
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm"
                                      onClick={() => updateRequestStatus(request.id, "processing")}
                                      className="bg-status-processing hover:bg-status-processing/80"
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => updateRequestStatus(request.id, "rejected")}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                                
                                {request.status === "processing" && (
                                  <Button 
                                    size="sm"
                                    onClick={() => updateRequestStatus(request.id, "completed")}
                                    className="bg-status-completed hover:bg-status-completed/80"
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  Track performance metrics and business insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                  <p className="text-sm">Track revenue, popular services, and customer trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}