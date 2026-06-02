import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { DynamicForm } from "@/components/DynamicForm";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function ServiceApplication() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => api.get(`/services/${serviceId}`),
  });

  const mutation = useMutation({
    mutationFn: ({ formData, fileFields }) => {
      const multipartData = new FormData();
      multipartData.append("serviceId", service._id);
      multipartData.append("amount", service.price);
      if (service.tenant) {
        multipartData.append("tenantId", service.tenant);
      }
      multipartData.append("formData", JSON.stringify(formData));

      Object.entries(fileFields).forEach(([fieldName, fileList]) => {
        Array.from(fileList).forEach((file) => {
          multipartData.append("documents", file, file.name);
        });
      });

      return api.postForm("/applications", multipartData);
    },
    onSuccess: (data) => {
      toast({
        title: language === 'hi' ? "आवेदन जमा हो गया!" : "Application Submitted!",
        description: language === 'hi' ? "आपका आवेदन सफलतापूर्वक जमा कर दिया गया है।" : "Your application has been submitted successfully.",
      });
      navigate(`/success/${data._id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: language === 'hi' ? "सबमिशन विफल" : "Submission Failed",
        description: error.message,
      });
    },
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm font-semibold text-destructive">
          {language === 'hi' ? "सेवा लोड करने में त्रुटि" : "Error loading service"}
        </div>
      </div>
    );
  }

  const handleSubmit = ({ formData, fileFields }) => {
    mutation.mutate({ formData, fileFields });
  };

  const sCategory = language === 'hi' && service.categoryHindi ? service.categoryHindi : service.category;
  const sTitle = language === 'hi' && service.titleHindi ? service.titleHindi : service.title;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/20 via-background to-background dark:from-slate-950 dark:via-background dark:to-background pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'hi' ? "पीछे" : "Back"}
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
              {language === 'hi' ? "सेवा के लिए आवेदन करें" : "Apply for Service"}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-none rounded-lg px-2.5">
                {sCategory}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">{sTitle}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
                <CardHeader className="pb-3 border-b border-border/20">
                  <CardTitle className="text-base font-bold">
                    {language === 'hi' ? "आवेदन पत्र" : "Application Form"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {language === 'hi' ? "कृपया आवश्यक जानकारी सटीक रूप से प्रदान करें।" : "Please provide the required information accurately."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <DynamicForm
                    schema={service.formSchema}
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
                <CardHeader className="pb-3 border-b border-border/20">
                  <CardTitle className="text-base font-bold">
                    {language === 'hi' ? "सेवा सारांश" : "Service Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{language === 'hi' ? "सेवा शुल्क:" : "Service Fee:"}</span>
                    <span className="text-sm font-extrabold text-primary">₹{service.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{language === 'hi' ? "अनुमानित समय:" : "Est. Time:"}</span>
                    <span className="text-foreground">{service.estimatedTime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/15 dark:border-amber-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-sm font-bold">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    {language === 'hi' ? "महत्वपूर्ण सुझाव" : "Important Tips"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-amber-700/90 dark:text-amber-400/90 leading-relaxed font-semibold">
                  <p>• {language === 'hi' ? "जमा करने से पहले अपने विवरण की दोबारा जांच करें।" : "Double check your details before submitting."}</p>
                  <p>• {language === 'hi' ? "स्कैन किए गए दस्तावेज़ स्पष्ट रूप से दिखाई देने चाहिए।" : "Scanned documents must be clearly visible."}</p>
                  <p>• {language === 'hi' ? "स्वीकृत फाइलें: चित्र (JPG, PNG, WebP) और PDF।" : "Allowed files: Images (JPG, PNG, WebP) & PDF."}</p>
                  <p>• {language === 'hi' ? "आकार सीमा: प्रति फ़ाइल 10MB।" : "Size limit: 10MB per file."}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
