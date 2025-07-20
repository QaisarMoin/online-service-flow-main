import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { services } from "@/data/services";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export default function ServiceApplication() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    additionalNotes: "",
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setUploadedFiles(prev => [...prev, newFile]);
    });

    toast({
      title: "Files uploaded successfully",
      description: `${files.length} file(s) added to your application`,
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application submitted successfully!",
        description: "You will receive a confirmation email with your reference number shortly.",
      });
      
      // Navigate to a success page or back to home
      navigate("/", { replace: true });
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/service/${serviceId}`)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service Details
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Service</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{service.category}</Badge>
              <span className="text-muted-foreground">{service.title}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Please provide your accurate details for service processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 99999 88888"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                        placeholder="Any special instructions or additional information"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Document Upload
                    </CardTitle>
                    <CardDescription>
                      Please upload all required documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Required Documents List */}
                    <div className="grid gap-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Required Documents:</h4>
                      {service.requiredDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {doc}
                        </div>
                      ))}
                    </div>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Click to upload files or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 5MB each</p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Uploaded Files:</h4>
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Service Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span className="font-semibold">₹{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing Time:</span>
                      <span>{service.estimatedTime}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Notice */}
                <Card className="border-warning/20 bg-warning/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-warning text-base">
                      <AlertTriangle className="w-4 h-4" />
                      Important Notice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• All documents will be verified before processing</p>
                    <p>• Incorrect or incomplete information may cause delays</p>
                    <p>• You will receive SMS/Email updates on application status</p>
                    <p>• Processing time starts after document verification</p>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                  className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
                  size="lg"
                >
                  {isSubmitting ? (
                    "Submitting Application..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}