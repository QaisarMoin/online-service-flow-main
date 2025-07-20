import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Clock, IndianRupee, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { services } from "@/data/services";
import { Header } from "@/components/Header";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
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

  const handleApplyService = () => {
    setIsSubmitting(true);
    // Simulate navigation to application form
    setTimeout(() => {
      navigate(`/apply/${service.id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Service Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary">{service.category}</Badge>
                        {service.isPopular && (
                          <Badge className="bg-warning text-warning-foreground">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl lg:text-3xl mb-3">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-xl font-bold text-primary">₹{service.price}</div>
                        <div className="text-xs text-muted-foreground">All inclusive</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">{service.estimatedTime}</div>
                        <div className="text-xs text-muted-foreground">Processing time</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Required Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Required Documents
                  </CardTitle>
                  <CardDescription>
                    Please ensure you have all the following documents ready before applying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {service.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              {service.instructions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Important Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {service.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Processing Steps */}
              {service.processingSteps && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Steps</CardTitle>
                    <CardDescription>
                      Here's what happens after you submit your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {service.processingSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm">{step}</span>
                            {index < service.processingSteps.length - 1 && (
                              <div className="w-px h-6 bg-border ml-4 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Apply for Service</CardTitle>
                  <CardDescription>
                    Ready to proceed? Click below to start your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">₹{service.price}</div>
                    <div className="text-sm text-muted-foreground">Total fee (including all charges)</div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service fee:</span>
                      <span>₹{Math.round(service.price * 0.85)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing fee:</span>
                      <span>₹{Math.round(service.price * 0.1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee:</span>
                      <span>₹{Math.round(service.price * 0.05)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{service.price}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleApplyService}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
                    size="lg"
                  >
                    {isSubmitting ? (
                      "Redirecting..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    You'll be able to upload documents and complete payment in the next step
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}