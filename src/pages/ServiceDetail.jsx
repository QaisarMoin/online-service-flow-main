import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Clock,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useTranslation } from "@/hooks/useTranslation";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useTranslation();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => api.get(`/services/${serviceId}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm font-semibold text-muted-foreground">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{language === 'hi' ? "सेवा नहीं मिली" : "Service Not Found"}</h1>
            <Button onClick={() => navigate("/")} variant="outline" className="h-10 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToServices")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyService = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        variant: "destructive",
        title: language === 'hi' ? "प्रमाणीकरण आवश्यक" : "Authentication Required",
        description: language === 'hi' ? "इस सेवा के लिए आवेदन करने के लिए कृपया लॉगिन करें।" : "Please login to apply for this service.",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    // Simulate navigation to application form
    setTimeout(() => {
      navigate(`/apply/${service._id}`);
    }, 500);
  };

  const sCategory = language === 'hi' && service.categoryHindi ? service.categoryHindi : service.category;
  const sTitle = language === 'hi' && service.titleHindi ? service.titleHindi : service.title;
  const sDescription = language === 'hi' && service.descriptionHindi ? service.descriptionHindi : service.description;
  const sRequiredDocuments = language === 'hi' && service.requiredDocumentsHindi?.length ? service.requiredDocumentsHindi : service.requiredDocuments;
  const sInstructions = language === 'hi' && service.instructionsHindi?.length ? service.instructionsHindi : service.instructions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/20 via-background to-background dark:from-slate-950 dark:via-background dark:to-background pb-12">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToServices")}
          </Button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content */}
            <div className="flex-1 w-full space-y-6">
              {/* Service Header */}
              <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-4">
                        <Badge variant="secondary" className="text-[11px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-none rounded-lg px-2.5 py-0.5">
                          {sCategory}
                        </Badge>
                        {service.isPopular && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-lg border-none">
                            {t("popularTag")}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4">
                        {sTitle}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground font-normal">
                        {sDescription}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8 border-t border-border/30 pt-6">
                    <div className="flex items-center gap-3 bg-secondary/60 dark:bg-secondary/20 px-5 py-3 rounded-2xl border border-border/20">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-semibold">{language === 'hi' ? "कुल शुल्क" : "Total Fee"}</div>
                        <div className="text-lg font-extrabold text-foreground">
                          ₹{service.price}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-secondary/60 dark:bg-secondary/20 px-5 py-3 rounded-2xl border border-border/20">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-semibold">{t("estimatedTime")}</div>
                        <div className="text-sm font-bold text-foreground">
                          {service.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents */}
              {sRequiredDocuments && sRequiredDocuments.length > 0 && (
                <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
                  <CardHeader className="pb-3 border-b border-border/20">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                      <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      {t("requiredDocuments")}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {language === 'hi' ? "कृपया निम्नलिखित दस्तावेजों के स्कैन या फोटो तैयार रखें:" : "Please prepare scans or photographs of the following documents:"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {sRequiredDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3.5 bg-secondary/30 dark:bg-secondary/10 border border-border/20 rounded-xl hover:border-primary/20 hover:bg-secondary/40 dark:hover:bg-secondary/20 transition-all duration-200"
                        >
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-xs font-semibold text-foreground/80">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              {sInstructions && sInstructions.length > 0 && (
                <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
                  <CardHeader className="pb-3 border-b border-border/20">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                      <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                        <AlertCircle className="w-4.5 h-4.5" />
                      </div>
                      {t("instructions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="space-y-4">
                      {sInstructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3.5">
                          <div className="w-6 h-6 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-extrabold mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-xs leading-relaxed text-muted-foreground font-medium pt-0.5">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Checkout Summary Widget */}
            <div className="w-full lg:w-80 lg:sticky lg:top-24">
              <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-card">
                <div className="bg-primary/5 px-6 py-5 border-b border-border/20">
                  <CardTitle className="text-base font-bold text-foreground">{language === 'hi' ? "सेवा के लिए आवेदन करें" : "Apply for Service"}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {language === 'hi' ? "फॉर्म भरें और अपना अनुरोध तुरंत जमा करें।" : "Fill the form and submit your request instantly."}
                  </CardDescription>
                </div>
                <CardContent className="p-6 space-y-5">
                  <div className="text-center bg-secondary/40 dark:bg-secondary/15 py-4 rounded-2xl border border-border/30">
                    <div className="text-sm text-muted-foreground font-semibold mb-1">{language === 'hi' ? "कुल मूल्य" : "Total Pricing"}</div>
                    <div className="text-3xl font-extrabold text-primary tracking-tight">
                      ₹{service.price}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium mt-1">
                      {language === 'hi' ? "सभी करों और पोर्टल शुल्कों सहित" : "Inclusive of all taxes & portal fees"}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{language === 'hi' ? "सेवा शुल्क:" : "Service fee:"}</span>
                      <span className="font-semibold text-foreground">₹{Math.round(service.price * 0.85)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{language === 'hi' ? "प्रसंस्करण शुल्क:" : "Processing fee:"}</span>
                      <span className="font-semibold text-foreground">₹{Math.round(service.price * 0.1)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{language === 'hi' ? "प्लेटफ़ॉर्म सुविधा शुल्क:" : "Platform convenience:"}</span>
                      <span className="font-semibold text-foreground">₹{Math.round(service.price * 0.05)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm font-bold text-foreground">
                      <span>{language === 'hi' ? "कुल राशि:" : "Total Amount:"}</span>
                      <span className="text-primary">₹{service.price}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleApplyService}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 transition-all duration-200 font-semibold"
                    size="lg"
                  >
                    {isSubmitting ? (
                      language === 'hi' ? "पुनर्निर्देशित किया जा रहा है..." : "Redirecting..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        {t("applyNow")}
                      </>
                    )}
                  </Button>

                  <div className="text-[10px] text-muted-foreground text-center leading-normal">
                    {language === 'hi' 
                      ? "जमा करने के बाद सुरक्षित दस्तावेज़ सबमिशन और निर्बाध डिजिटल ट्रैकिंग डैशबोर्ड सक्रिय हो जाएगा।" 
                      : "Secure documents submission and seamless digital tracking dashboard will be active after submission."}
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
