import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, Languages } from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const translateToHindi = async (text) => {
  if (!text || !text.trim()) return "";
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    if (data && data[0]) {
      return data[0].map(x => x[0]).join("").trim();
    }
    return "";
  } catch (error) {
    console.error("Translation error:", error);
    return "";
  }
};

export default function EditService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!serviceInfo.title && !serviceInfo.category && !serviceInfo.description && fields.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter some English details to translate first.",
      });
      return;
    }
    setIsTranslating(true);
    try {
      const translatedTitle = await translateToHindi(serviceInfo.title);
      const translatedCategory = await translateToHindi(serviceInfo.category);
      const translatedDescription = await translateToHindi(serviceInfo.description);
      const translatedInstructions = await translateToHindi(serviceInfo.instructions);
      const translatedRequiredDocs = await translateToHindi(serviceInfo.requiredDocuments);

      setServiceInfo(prev => ({
        ...prev,
        titleHindi: translatedTitle || prev.titleHindi,
        categoryHindi: translatedCategory || prev.categoryHindi,
        descriptionHindi: translatedDescription || prev.descriptionHindi,
        instructionsHindi: translatedInstructions || prev.instructionsHindi,
        requiredDocumentsHindi: translatedRequiredDocs || prev.requiredDocumentsHindi,
      }));

      // Translate all form schema fields
      const updatedFields = await Promise.all(
        fields.map(async (field) => {
          const labelHindi = await translateToHindi(field.label);
          const placeholderHindi = field.placeholder ? await translateToHindi(field.placeholder) : "";
          return {
            ...field,
            labelHindi: labelHindi || field.labelHindi,
            placeholderHindi: placeholderHindi || field.placeholderHindi,
          };
        })
      );
      setFields(updatedFields);

      toast({
        title: "Translation Complete",
        description: "All fields have been automatically translated to Hindi.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "An error occurred while translating. Please try again.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const [serviceInfo, setServiceInfo] = useState({
    title: "",
    titleHindi: "",
    description: "",
    descriptionHindi: "",
    category: "",
    categoryHindi: "",
    price: "",
    estimatedTime: "",
    instructions: "",
    instructionsHindi: "",
    requiredDocuments: "",
    requiredDocumentsHindi: "",
  });
  const [fields, setFields] = useState([]);

  // Authentication check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin" && user.role !== "super_admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch service data
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => api.get(`/services/${serviceId}`),
  });

  // Pre-fill data
  useEffect(() => {
    if (service) {
      setServiceInfo({
        title: service.title || "",
        titleHindi: service.titleHindi || "",
        description: service.description || "",
        descriptionHindi: service.descriptionHindi || "",
        category: service.category || "",
        categoryHindi: service.categoryHindi || "",
        price: service.price || "",
        estimatedTime: service.estimatedTime || "",
        instructions: service.instructions ? service.instructions.join('\n') : "",
        instructionsHindi: service.instructionsHindi ? service.instructionsHindi.join('\n') : "",
        requiredDocuments: service.requiredDocuments ? service.requiredDocuments.join('\n') : "",
        requiredDocumentsHindi: service.requiredDocumentsHindi ? service.requiredDocumentsHindi.join('\n') : "",
      });
      setFields(service.formSchema || []);
    }
  }, [service]);

  const addField = () => {
    setFields([
      ...fields,
      { type: "text", label: `Field ${fields.length + 1}`, labelHindi: "", placeholder: "", placeholderHindi: "", required: false, order: fields.length },
    ]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSave = async () => {
    if (!serviceInfo.title || !serviceInfo.price) {
      toast({ variant: "destructive", title: "Error", description: "Title and Price are required" });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...serviceInfo,
        instructions: serviceInfo.instructions ? serviceInfo.instructions.split('\n').filter(Boolean) : [],
        instructionsHindi: serviceInfo.instructionsHindi ? serviceInfo.instructionsHindi.split('\n').filter(Boolean) : [],
        requiredDocuments: serviceInfo.requiredDocuments ? serviceInfo.requiredDocuments.split('\n').filter(Boolean) : [],
        requiredDocumentsHindi: serviceInfo.requiredDocumentsHindi ? serviceInfo.requiredDocumentsHindi.split('\n').filter(Boolean) : [],
        formSchema: fields.map((f, i) => ({ ...f, order: i }))
      };

      await api.patch(`/services/${serviceId}`, payload);
      
      queryClient.invalidateQueries(["services"]);
      queryClient.invalidateQueries(["service", serviceId]);

      toast({
        title: "Service Updated",
        description: "Your changes have been saved successfully.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading Service...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1">Edit Service</h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Modify existing digital offering configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAutoTranslate}
              disabled={isTranslating || isSaving}
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/5 rounded-xl h-11 px-5 transition-all duration-200 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Languages className="w-4 h-4" />
              {isTranslating ? "Translating..." : "Auto-Translate to Hindi"}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isTranslating}
              className="bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 px-5 transition-all duration-200 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Service Basic Information (Col Span 7) */}
          <div className="lg:col-span-7">
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base font-bold">Service Basic Information</CardTitle>
                <CardDescription className="text-xs">Update general details about this service</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Title (English)</Label>
                    <Input 
                      value={serviceInfo.title}
                      onChange={(e) => setServiceInfo({...serviceInfo, title: e.target.value})}
                      placeholder="e.g. Aadhaar Card Correction" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Title (Hindi)</Label>
                    <Input 
                      value={serviceInfo.titleHindi}
                      onChange={(e) => setServiceInfo({...serviceInfo, titleHindi: e.target.value})}
                      placeholder="जैसे आधार कार्ड सुधार" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Category (English)</Label>
                    <Input 
                      value={serviceInfo.category}
                      onChange={(e) => setServiceInfo({...serviceInfo, category: e.target.value})}
                      placeholder="e.g. Identity Documents" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Category (Hindi)</Label>
                    <Input 
                      value={serviceInfo.categoryHindi}
                      onChange={(e) => setServiceInfo({...serviceInfo, categoryHindi: e.target.value})}
                      placeholder="जैसे पहचान दस्तावेज" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Description (English)</Label>
                    <Textarea 
                      value={serviceInfo.description}
                      onChange={(e) => setServiceInfo({...serviceInfo, description: e.target.value})}
                      placeholder="Brief description of the service" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Description (Hindi)</Label>
                    <Textarea 
                      value={serviceInfo.descriptionHindi}
                      onChange={(e) => setServiceInfo({...serviceInfo, descriptionHindi: e.target.value})}
                      placeholder="सेवा का संक्षिप्त विवरण" 
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={serviceInfo.price}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, price: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Estimated Time</Label>
                    <Input
                      placeholder="e.g. 2-3 Working Days"
                      value={serviceInfo.estimatedTime}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, estimatedTime: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Instructions (English) (One per line)</Label>
                    <Textarea
                      placeholder="e.g. Please verify spelling before submitting.&#10;Documents must be clear."
                      value={serviceInfo.instructions}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, instructions: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card font-semibold text-xs leading-normal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Instructions (Hindi) (One per line)</Label>
                    <Textarea
                      placeholder="जैसे कृपया जमा करने से पहले वर्तनी की जांच करें।&#10;दस्तावेज स्पष्ट होने चाहिए।"
                      value={serviceInfo.instructionsHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, instructionsHindi: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card font-semibold text-xs leading-normal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Required Documents (English) (One per line)</Label>
                    <Textarea
                      placeholder="e.g. Aadhar Card&#10;PAN Card"
                      value={serviceInfo.requiredDocuments}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, requiredDocuments: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card font-semibold text-xs leading-normal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground/80">Required Documents (Hindi) (One per line)</Label>
                    <Textarea
                      placeholder="जैसे आधार कार्ड&#10;पैन कार्ड"
                      value={serviceInfo.requiredDocumentsHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, requiredDocumentsHindi: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 min-h-[80px] text-sm bg-card font-semibold text-xs leading-normal"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder (Col Span 5) */}
          <div className="lg:col-span-5">
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/20">
                <div>
                  <CardTitle className="text-base font-bold">Form Builder</CardTitle>
                  <CardDescription className="text-xs">Define the fields users need to fill out</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={addField}
                  className="rounded-full px-6 text-xs sm:text-sm font-semibold h-11 transition-all duration-200"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground font-semibold">
                    No custom fields added yet. Click 'Add Field' above.
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border border-border/40 rounded-2xl bg-secondary/20 relative group">
                      <div className="mt-2.5 text-muted-foreground/60 cursor-move">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-foreground/70">Field Label (English)</Label>
                            <Input 
                              value={field.label}
                              onChange={(e) => updateField(index, "label", e.target.value)}
                              className="rounded-lg border-border/60 focus-visible:ring-primary/20 h-8 text-xs bg-card"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-foreground/70">Field Label (Hindi)</Label>
                            <Input 
                              value={field.labelHindi || ""}
                              onChange={(e) => updateField(index, "labelHindi", e.target.value)}
                              className="rounded-lg border-border/60 focus-visible:ring-primary/20 h-8 text-xs bg-card"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-foreground/70">Placeholder (English)</Label>
                            <Input 
                              value={field.placeholder || ""}
                              onChange={(e) => updateField(index, "placeholder", e.target.value)}
                              className="rounded-lg border-border/60 focus-visible:ring-primary/20 h-8 text-xs bg-card"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-foreground/70">Placeholder (Hindi)</Label>
                            <Input 
                              value={field.placeholderHindi || ""}
                              onChange={(e) => updateField(index, "placeholderHindi", e.target.value)}
                              className="rounded-lg border-border/60 focus-visible:ring-primary/20 h-8 text-xs bg-card"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-foreground/70">Type</Label>
                            <Select 
                              value={field.type}
                              onValueChange={(val) => updateField(index, "type", val)}
                            >
                              <SelectTrigger className="rounded-lg border-border/60 focus-visible:ring-primary/20 h-8 text-xs bg-card">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-border/60 bg-card">
                                <SelectItem value="text" className="rounded-lg text-xs py-1">Text</SelectItem>
                                <SelectItem value="textarea" className="rounded-lg text-xs py-1">Long Text</SelectItem>
                                <SelectItem value="number" className="rounded-lg text-xs py-1">Number</SelectItem>
                                <SelectItem value="email" className="rounded-lg text-xs py-1">Email</SelectItem>
                                <SelectItem value="date" className="rounded-lg text-xs py-1">Date</SelectItem>
                                <SelectItem value="select" className="rounded-lg text-xs py-1">Dropdown</SelectItem>
                                <SelectItem value="file" className="rounded-lg text-xs py-1">File Upload</SelectItem>
                                <SelectItem value="image" className="rounded-lg text-xs py-1">Image Upload</SelectItem>
                                <SelectItem value="pdf" className="rounded-lg text-xs py-1">PDF Upload</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2 pt-6 pl-1">
                            <input 
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(index, "required", e.target.checked)}
                              id={`req-${index}`}
                              className="w-3.5 h-3.5 rounded border-border/60 accent-primary cursor-pointer"
                            />
                            <Label htmlFor={`req-${index}`} className="text-[10px] font-bold text-foreground/70 cursor-pointer select-none">Required</Label>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeField(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg w-7 h-7 p-0 ml-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
