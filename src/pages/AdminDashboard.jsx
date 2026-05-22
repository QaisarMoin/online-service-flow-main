import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RequestDetailModal } from "@/components/RequestDetailModal";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin" && user.role !== "super_admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["applications"],
    queryFn: () => api.get("/applications"),
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/applications/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      toast({ title: "Status Updated", description: "Application status has been changed." });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      toast({ title: "Service Deleted", description: "The service has been removed successfully." });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  });

  const filteredRequests = requests.filter((request) => {
    const customerName = request.customer?.name || "";
    const serviceTitle = request.service?.title || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    completed: requests.filter((r) => r.status === "completed").length,
    revenue: requests.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.amount, 0),
  };

  const handleDownloadZip = (id) => {
    // Open the download link in a new tab
    const token = localStorage.getItem('token');
    window.open(`https://online-service-flow-main.onrender.com/api/applications/${id}/download-zip?token=${token}`, '_blank');
  };

  if (isLoadingRequests || isLoadingServices) return <div className="p-8 text-center">Loading dashboard data...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage service requests and track performance</p>
          </div>
          <Button onClick={() => navigate("/admin/create-service")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{statusCounts.revenue}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="services">Manage Services</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request._id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">{request._id}</Badge>
                            <StatusBadge status={request.status} />
                          </div>
                          <h3 className="font-bold">{request.service?.title}</h3>
                          <p className="text-sm text-muted-foreground">{request.customer?.name} ({request.customer?.email})</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-4">
                            <div className="font-bold">₹{request.amount}</div>
                            <div className="text-[10px] text-muted-foreground">Paid</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedRequest(request); setIsModalOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadZip(request._id)}>
                            <Download className="w-4 h-4 mr-2" />
                            ZIP
                          </Button>
                          
                          {request.status === "pending" && (
                            <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: request._id, status: "processing" })}>
                              Accept
                            </Button>
                          )}
                          {request.status === "processing" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatusMutation.mutate({ id: request._id, status: "completed" })}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-card rounded-xl border">
                  <p className="text-muted-foreground mb-4">No services created yet.</p>
                  <Button onClick={() => navigate("/admin/create-service")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Service
                  </Button>
                </div>
              ) : (
                services.map((service) => (
                  <Card key={service._id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="font-bold text-lg">₹{service.price}</span>
                      </div>
                      <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="font-medium text-foreground">{service.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium text-foreground">{service.estimatedTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/admin/edit-service/${service._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          if(confirm("Are you sure you want to delete this service?")) {
                            deleteServiceMutation.mutate(service._id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <RequestDetailModal 
        request={selectedRequest} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function Select({ value, onValueChange, children }) {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="px-3 py-2 border rounded-md bg-background text-sm"
    >
      {children}
    </select>
  );
}
