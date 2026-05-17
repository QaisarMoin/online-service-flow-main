import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Printer, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Header } from "@/components/Header";

export default function ApplicationSuccess() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Card className="max-w-md w-full text-center border-success/20 shadow-lg print:shadow-none print:border-none print:max-w-full">
          <CardHeader className="space-y-4 pt-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
            </div>
            <CardTitle className="text-3xl text-success font-bold">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your application has been received.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-accent p-6 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Your Tracking Token</p>
              <div className="text-2xl font-mono font-bold tracking-widest text-primary break-all bg-background py-3 px-4 rounded-lg shadow-inner">
                {applicationId}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Please save this token. You can use it to track your application status.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 print:hidden">
            <Button onClick={handlePrint} className="w-full bg-primary" size="lg">
              <Printer className="w-4 h-4 mr-2" />
              Print / Save as PDF
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full" size="lg">
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
