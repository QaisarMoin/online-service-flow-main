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
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

import { api } from "@/lib/api";

export default function CreateService() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Authentication check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin" && user.role !== "super_admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    estimatedTime: "",
    instructions: "",
    requiredDocuments: "",
  });
  const [fields, setFields] = useState([
    { type: "text", label: "Full Name", required: true, order: 0 },
  ]);

  const addField = () => {
    setFields([
      ...fields,
      { type: "text", label: `Field ${fields.length + 1}`, required: false, order: fields.length },
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
        requiredDocuments: serviceInfo.requiredDocuments ? serviceInfo.requiredDocuments.split('\n').filter(Boolean) : [],
        formSchema: fields.map((f, i) => ({ ...f, order: i }))
      };

      await api.post("/services", payload);
      
      queryClient.invalidateQueries(["services"]);

      toast({
        title: "Service Created",
        description: "Your new service has been saved successfully.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error.message || "Please check if the backend is running.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Create New Service</h1>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Service"}
            </Button>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Service Basic Information</CardTitle>
                <CardDescription>General details about the service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      value={serviceInfo.title}
                      onChange={(e) => setServiceInfo({...serviceInfo, title: e.target.value})}
                      placeholder="e.g. Aadhaar Card Correction" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input 
                      value={serviceInfo.category}
                      onChange={(e) => setServiceInfo({...serviceInfo, category: e.target.value})}
                      placeholder="e.g. Identity Documents" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={serviceInfo.description}
                    onChange={(e) => setServiceInfo({...serviceInfo, description: e.target.value})}
                    placeholder="Brief description of the service" 
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={serviceInfo.price}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Time</Label>
                    <Input
                      placeholder="e.g. 2-3 Working Days"
                      value={serviceInfo.estimatedTime}
                      onChange={(e) => setServiceInfo({ ...serviceInfo, estimatedTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Important Instructions (One per line)</Label>
                  <Textarea
                    placeholder="e.g. Please verify spelling before submitting.\nDocuments must be clear."
                    value={serviceInfo.instructions}
                    onChange={(e) => setServiceInfo({ ...serviceInfo, instructions: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Documents (One per line)</Label>
                  <Textarea
                    placeholder="e.g. Aadhar Card\nPAN Card"
                    value={serviceInfo.requiredDocuments}
                    onChange={(e) => setServiceInfo({ ...serviceInfo, requiredDocuments: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Form Builder</CardTitle>
                  <CardDescription>Define the fields users need to fill out</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addField}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-accent/20">
                    <div className="mt-2 text-muted-foreground cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="grid flex-1 grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Field Label</Label>
                        <Input 
                          value={field.label}
                          onChange={(e) => updateField(index, "label", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Type</Label>
                        <Select 
                          value={field.type}
                          onValueChange={(val) => updateField(index, "type", val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                            <SelectItem value="image">Image Upload</SelectItem>
                            <SelectItem value="pdf">PDF Upload</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <input 
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(index, "required", e.target.checked)}
                          id={`req-${index}`}
                        />
                        <Label htmlFor={`req-${index}`} className="text-xs">Required</Label>
                      </div>
                      <div className="pt-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeField(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
