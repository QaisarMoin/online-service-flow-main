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

export default function ServiceApplication() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => api.get(`/services/${serviceId}`),
  });

  const mutation = useMutation({
    mutationFn: (formData) => api.post("/applications", {
      serviceId: service._id,
      formData,
      amount: service.price,
    }),
    onSuccess: (data) => {
      toast({
        title: "Payment Successful!",
        description: "Your application has been submitted and payment verified.",
      });
      // Redirect to the ticket/success page with the new tracking ID
      navigate(`/success/${data._id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading service</div>;

  const handleSubmit = (data) => {
    // In a real app, this is where Razorpay integration would go.
    // Simulating a payment verification delay of 1.5 seconds.
    setTimeout(() => {
      mutation.mutate(data);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Service</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{service.category}</Badge>
              <span className="text-muted-foreground">{service.title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>
                    Please provide the required information accurately.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicForm 
                    schema={service.formSchema} 
                    onSubmit={handleSubmit}
                    isSubmitting={mutation.isPending}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span className="font-semibold">₹{service.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Est. Time:</span>
                    <span>{service.estimatedTime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-base">
                    <AlertTriangle className="w-4 h-4" />
                    Important
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-yellow-700 dark:text-yellow-400">
                  <p>• Verify all details before submission.</p>
                  <p>• Uploaded documents must be clear and readable.</p>
                  <p>• Payment is required to process the application.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
