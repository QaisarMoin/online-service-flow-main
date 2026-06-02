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
    <div className="min-h-screen bg-gradient-to-b from-blue-50/10 via-background to-background dark:from-slate-950 dark:via-background dark:to-background pb-12">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Manage service requests and track center performance</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/create-service")}
            className="bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-10 px-4 transition-all duration-200"
          >
            <Plus className="w-4.5 h-4.5 mr-1.5" />
            <span className="text-xs font-semibold">Create Service</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Requests</CardTitle>
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{statusCounts.total}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Review</CardTitle>
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-500">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-500">{statusCounts.completed}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">₹{statusCounts.revenue}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="bg-secondary/60 border border-border/40 p-1 rounded-xl h-10.5">
            <TabsTrigger value="requests" className="rounded-lg px-4 text-xs font-semibold py-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">Service Requests</TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg px-4 text-xs font-semibold py-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">Manage Services</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm"
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
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 text-sm text-muted-foreground font-semibold">
                      No service requests found.
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <Card key={request._id} className="hover:shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-border/50 rounded-xl transition-shadow bg-card overflow-hidden">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-[10px] font-mono border-border/60 text-muted-foreground px-2 py-0.5 rounded-lg select-all">
                                {request._id}
                              </Badge>
                              <StatusBadge status={request.status} />
                            </div>
                            <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight truncate mb-1">
                              {request.service?.title}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {request.customer?.name} ({request.customer?.email})
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/30 pt-3 md:pt-0">
                            <div className="text-left md:text-right mr-2 md:mr-4">
                              <div className="font-extrabold text-foreground text-base">₹{request.amount}</div>
                              <div className="text-[10px] text-muted-foreground font-medium">Paid</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => { setSelectedRequest(request); setIsModalOpen(true); }}
                                className="border-border/80 hover:bg-secondary rounded-xl text-xs sm:text-sm font-bold px-5 h-11 min-w-[90px] transition-all"
                              >
                                <Eye className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => handleDownloadZip(request._id)}
                                className="border-border/80 hover:bg-secondary rounded-xl text-xs sm:text-sm font-bold px-5 h-11 min-w-[80px] transition-all"
                              >
                                <Download className="w-4 h-4 mr-1.5 text-muted-foreground" />
                                ZIP
                              </Button>
                              
                              {request.status === "pending" && (
                                <Button 
                                  onClick={() => updateStatusMutation.mutate({ id: request._id, status: "processing" })}
                                  className="bg-primary hover:bg-primary-hover text-white rounded-xl text-xs sm:text-sm font-bold px-5 h-11 min-w-[95px] shadow-sm transition-all"
                                >
                                  Accept
                                </Button>
                              )}
                              {request.status === "processing" && (
                                <Button 
                                  onClick={() => updateStatusMutation.mutate({ id: request._id, status: "completed" })}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold px-5 h-11 min-w-[110px] shadow-sm transition-all"
                                >
                                  Complete
                                </Button>
                              )}
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
          
          <TabsContent value="services" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-card border-dashed border-border/80 rounded-2xl">
                  <p className="text-muted-foreground mb-4 text-sm font-semibold">No services created yet.</p>
                  <Button 
                    onClick={() => navigate("/admin/create-service")}
                    className="bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold px-4 h-10 shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Service
                  </Button>
                </div>
              ) : (
                services.map((service) => (
                  <Card key={service._id} className="flex flex-col bg-card border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          className={`text-[10px] font-bold border-none px-2.5 py-0.5 rounded-lg ${
                            service.isActive 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="font-extrabold text-foreground text-lg">₹{service.price}</span>
                      </div>
                      <CardTitle className="line-clamp-1 text-sm font-bold text-foreground leading-snug">{service.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-normal mt-1">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4 pt-0">
                      <div className="text-[11px] font-semibold text-muted-foreground space-y-2 border-t border-border/30 pt-3">
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="text-foreground">{service.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Time:</span>
                          <span className="text-foreground">{service.estimatedTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-0 pb-4 px-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-border/80 hover:bg-secondary rounded-xl text-xs font-semibold h-10 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/admin/edit-service/${service._id}`)}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1 bg-destructive/10 hover:bg-destructive hover:text-white border-none rounded-xl text-xs font-semibold h-10 text-destructive"
                        onClick={() => {
                          if(confirm("Are you sure you want to delete this service?")) {
                            deleteServiceMutation.mutate(service._id);
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
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
      className="px-3.5 py-1.5 border border-border/60 rounded-xl bg-card text-muted-foreground hover:text-foreground text-xs font-semibold h-10 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer min-w-[130px]"
    >
      {children}
    </select>
  );
}
