import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
import { Plus, Trash2, GripVertical, Save, Languages, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// ── Google Translate (free) ──────────────────────────────────────────────────
const translateToHindi = async (text) => {
  if (!text || !text.trim()) return "";
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data?.[0]?.map((x) => x[0]).join("").trim() ?? "";
  } catch {
    return "";
  }
};

// ── Column header badge ──────────────────────────────────────────────────────
function LangHeader({ lang }) {
  const isEn = lang === "en";
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-wide w-fit ${
        isEn
          ? "bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40"
          : "bg-orange-50 text-orange-600 border border-orange-200/60 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/40"
      }`}
    >
      {isEn ? "🇬🇧 English" : "🇮🇳 हिन्दी"}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CreateService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin" && user.role !== "super_admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [serviceInfo, setServiceInfo] = useState({
    title: "",        titleHindi: "",
    description: "",  descriptionHindi: "",
    category: "",     categoryHindi: "",
    price: "",        estimatedTime: "",
    instructions: "", instructionsHindi: "",
    requiredDocuments: "", requiredDocumentsHindi: "",
  });

  const [fields, setFields] = useState([
    { type: "text", label: "Full Name", labelHindi: "पूरा नाम", placeholder: "", placeholderHindi: "", required: true, order: 0 },
  ]);

  // ── Auto-translate ────────────────────────────────────────────────────────
  const handleAutoTranslate = async () => {
    if (!serviceInfo.title && !serviceInfo.category && !serviceInfo.description) {
      toast({ variant: "destructive", title: "No English content", description: "Fill in English fields first." });
      return;
    }
    setIsTranslating(true);
    try {
      const [tTitle, tCat, tDesc, tInstr, tDocs] = await Promise.all([
        translateToHindi(serviceInfo.title),
        translateToHindi(serviceInfo.category),
        translateToHindi(serviceInfo.description),
        translateToHindi(serviceInfo.instructions),
        translateToHindi(serviceInfo.requiredDocuments),
      ]);

      setServiceInfo((prev) => ({
        ...prev,
        titleHindi: tTitle || prev.titleHindi,
        categoryHindi: tCat || prev.categoryHindi,
        descriptionHindi: tDesc || prev.descriptionHindi,
        instructionsHindi: tInstr || prev.instructionsHindi,
        requiredDocumentsHindi: tDocs || prev.requiredDocumentsHindi,
      }));

      const updatedFields = await Promise.all(
        fields.map(async (f) => ({
          ...f,
          labelHindi: (await translateToHindi(f.label)) || f.labelHindi,
          placeholderHindi: (f.placeholder ? await translateToHindi(f.placeholder) : "") || f.placeholderHindi,
        }))
      );
      setFields(updatedFields);

      toast({ title: "Translation Complete ✓", description: "Hindi fields have been auto-filled. Review and edit as needed." });
    } catch {
      toast({ variant: "destructive", title: "Translation Failed", description: "Try again." });
    } finally {
      setIsTranslating(false);
    }
  };

  // ── Field helpers ─────────────────────────────────────────────────────────
  const addField = () =>
    setFields([...fields, { type: "text", label: `Field ${fields.length + 1}`, labelHindi: "", placeholder: "", placeholderHindi: "", required: false, order: fields.length }]);

  const removeField = (i) => setFields(fields.filter((_, idx) => idx !== i));

  const updateField = (i, key, value) => {
    const next = [...fields];
    next[i][key] = value;
    setFields(next);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!serviceInfo.title || !serviceInfo.price) {
      toast({ variant: "destructive", title: "Error", description: "Title and Price are required." });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...serviceInfo,
        instructions: serviceInfo.instructions ? serviceInfo.instructions.split("\n").filter(Boolean) : [],
        instructionsHindi: serviceInfo.instructionsHindi ? serviceInfo.instructionsHindi.split("\n").filter(Boolean) : [],
        requiredDocuments: serviceInfo.requiredDocuments ? serviceInfo.requiredDocuments.split("\n").filter(Boolean) : [],
        requiredDocumentsHindi: serviceInfo.requiredDocumentsHindi ? serviceInfo.requiredDocumentsHindi.split("\n").filter(Boolean) : [],
        formSchema: fields.map((f, i) => ({ ...f, order: i })),
      };
      await api.post("/services", payload);
      queryClient.invalidateQueries(["services"]);
      toast({ title: "Service Created", description: "Saved successfully." });
      navigate("/admin");
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to save", description: err.message || "Check backend." });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1">Create New Service</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Fill both English and Hindi columns together</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={handleAutoTranslate}
              disabled={isTranslating || isSaving}
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/5 rounded-xl h-11 px-5 text-xs sm:text-sm font-bold gap-2 transition-all"
            >
              {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              {isTranslating ? "Translating…" : "Auto-Translate → हिन्दी"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isTranslating}
              className="bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 px-5 text-xs sm:text-sm font-bold gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving…" : "Save Service"}
            </Button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── Left: Basic Info ─────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/20">
                <CardTitle className="text-base font-bold">Service Basic Information</CardTitle>
                <CardDescription className="text-xs">Fill each field in both languages simultaneously</CardDescription>

                {/* Column headers */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <LangHeader lang="en" />
                  <LangHeader lang="hi" />
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">

                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">Title</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={serviceInfo.title}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, title: e.target.value })}
                      placeholder="e.g. Aadhaar Card Correction"
                      className="rounded-xl border-border/60 focus-visible:ring-blue-400/30 h-10 text-sm bg-card"
                    />
                    <Input
                      value={serviceInfo.titleHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, titleHindi: e.target.value })}
                      placeholder="जैसे आधार कार्ड सुधार"
                      className="rounded-xl border-orange-200/60 focus-visible:ring-orange-400/30 h-10 text-sm bg-card"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">Category</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={serviceInfo.category}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, category: e.target.value })}
                      placeholder="e.g. Identity Documents"
                      className="rounded-xl border-border/60 focus-visible:ring-blue-400/30 h-10 text-sm bg-card"
                    />
                    <Input
                      value={serviceInfo.categoryHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, categoryHindi: e.target.value })}
                      placeholder="जैसे पहचान दस्तावेज"
                      className="rounded-xl border-orange-200/60 focus-visible:ring-orange-400/30 h-10 text-sm bg-card"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">Description</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Textarea
                      value={serviceInfo.description}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, description: e.target.value })}
                      placeholder="Brief description of the service"
                      className="rounded-xl border-border/60 focus-visible:ring-blue-400/30 min-h-[90px] text-sm bg-card resize-none"
                    />
                    <Textarea
                      value={serviceInfo.descriptionHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, descriptionHindi: e.target.value })}
                      placeholder="सेवा का संक्षिप्त विवरण"
                      className="rounded-xl border-orange-200/60 focus-visible:ring-orange-400/30 min-h-[90px] text-sm bg-card resize-none"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Price + Time — language-agnostic */}
                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="e.g. 2–3 Working Days"
                      value={serviceInfo.estimatedTime}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, estimatedTime: e.target.value })}
                      className="rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-sm bg-card"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">
                    Instructions <span className="font-normal text-muted-foreground">(one per line)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Textarea
                      value={serviceInfo.instructions}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, instructions: e.target.value })}
                      placeholder={"e.g. Verify spelling before submitting.\nDocuments must be clear."}
                      className="rounded-xl border-border/60 focus-visible:ring-blue-400/30 min-h-[80px] text-sm bg-card resize-none"
                    />
                    <Textarea
                      value={serviceInfo.instructionsHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, instructionsHindi: e.target.value })}
                      placeholder={"जैसे जमा करने से पहले जाँचें।\nदस्तावेज़ स्पष्ट होने चाहिए।"}
                      className="rounded-xl border-orange-200/60 focus-visible:ring-orange-400/30 min-h-[80px] text-sm bg-card resize-none"
                      dir="auto"
                    />
                  </div>
                </div>

                {/* Required Documents */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground/80">
                    Required Documents <span className="font-normal text-muted-foreground">(one per line)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Textarea
                      value={serviceInfo.requiredDocuments}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, requiredDocuments: e.target.value })}
                      placeholder={"e.g. Aadhar Card\nPAN Card"}
                      className="rounded-xl border-border/60 focus-visible:ring-blue-400/30 min-h-[80px] text-sm bg-card resize-none"
                    />
                    <Textarea
                      value={serviceInfo.requiredDocumentsHindi}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, requiredDocumentsHindi: e.target.value })}
                      placeholder={"जैसे आधार कार्ड\nपैन कार्ड"}
                      className="rounded-xl border-orange-200/60 focus-visible:ring-orange-400/30 min-h-[80px] text-sm bg-card resize-none"
                      dir="auto"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* ── Right: Form Builder ──────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <Card className="rounded-2xl border-border/50 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/20">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <CardTitle className="text-base font-bold">Form Builder</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Define fields users fill in both languages</CardDescription>
                  </div>
                  <Button variant="outline" onClick={addField} className="rounded-full px-5 text-xs font-bold h-9 transition-all gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Field
                  </Button>
                </div>
                {/* Column headers for form builder */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <LangHeader lang="en" />
                  <LangHeader lang="hi" />
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3 max-h-[660px] overflow-y-auto pr-1">
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground font-semibold">
                    No fields yet — click &ldquo;Add Field&rdquo; above.
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div key={index} className="p-4 border border-border/40 rounded-2xl bg-secondary/20 space-y-3">

                      {/* Drag handle + delete row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-muted-foreground/50 cursor-move">
                          <GripVertical className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold text-muted-foreground/60">Field {index + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                          className="text-destructive hover:bg-destructive/10 rounded-lg w-7 h-7 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Label EN + HI */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-foreground/70">Label</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(index, "label", e.target.value)}
                            placeholder="e.g. Full Name"
                            className="rounded-lg border-border/60 focus-visible:ring-blue-400/30 h-9 text-xs bg-card"
                          />
                          <Input
                            value={field.labelHindi || ""}
                            onChange={(e) => updateField(index, "labelHindi", e.target.value)}
                            placeholder="जैसे पूरा नाम"
                            className="rounded-lg border-orange-200/60 focus-visible:ring-orange-400/30 h-9 text-xs bg-card"
                            dir="auto"
                          />
                        </div>
                      </div>

                      {/* Placeholder EN + HI */}
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-foreground/70">Placeholder</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(index, "placeholder", e.target.value)}
                            placeholder="e.g. Enter your name"
                            className="rounded-lg border-border/60 focus-visible:ring-blue-400/30 h-9 text-xs bg-card"
                          />
                          <Input
                            value={field.placeholderHindi || ""}
                            onChange={(e) => updateField(index, "placeholderHindi", e.target.value)}
                            placeholder="जैसे अपना नाम दर्ज करें"
                            className="rounded-lg border-orange-200/60 focus-visible:ring-orange-400/30 h-9 text-xs bg-card"
                            dir="auto"
                          />
                        </div>
                      </div>

                      {/* Type + Required */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1">
                          <Label className="text-[10px] font-bold text-foreground/70">Type</Label>
                          <Select value={field.type} onValueChange={(val) => updateField(index, "type", val)}>
                            <SelectTrigger className="rounded-lg border-border/60 h-9 text-xs bg-card">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-card">
                              <SelectItem value="text" className="text-xs">Text</SelectItem>
                              <SelectItem value="textarea" className="text-xs">Long Text</SelectItem>
                              <SelectItem value="number" className="text-xs">Number</SelectItem>
                              <SelectItem value="email" className="text-xs">Email</SelectItem>
                              <SelectItem value="date" className="text-xs">Date</SelectItem>
                              <SelectItem value="select" className="text-xs">Dropdown</SelectItem>
                              <SelectItem value="file" className="text-xs">File Upload</SelectItem>
                              <SelectItem value="image" className="text-xs">Image Upload</SelectItem>
                              <SelectItem value="pdf" className="text-xs">PDF Upload</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, "required", e.target.checked)}
                            id={`req-${index}`}
                            className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                          />
                          <Label htmlFor={`req-${index}`} className="text-[10px] font-bold text-foreground/70 cursor-pointer select-none whitespace-nowrap">
                            Required
                          </Label>
                        </div>
                      </div>

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
