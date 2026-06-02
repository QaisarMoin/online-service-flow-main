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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/20 via-background to-background dark:from-slate-950 dark:via-background dark:to-background flex flex-col justify-between">
      <Header />
      
      <div className="flex-1 flex justify-center items-center px-4 py-16 relative">
        {/* Glow Blobs */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <Card className="max-w-md w-full text-center bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] relative z-10 print:shadow-none print:border-none print:max-w-full">
          <CardHeader className="space-y-4 pt-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-emerald-500 font-extrabold tracking-tight">Payment Successful!</CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground leading-normal">
              Your application has been received and is now processing.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-secondary/40 dark:bg-secondary/15 p-6 rounded-2xl border border-border/40">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-widest font-extrabold">Your Tracking Token</p>
              <div className="text-xl font-mono font-bold tracking-widest text-primary break-all bg-card py-3 px-4 rounded-xl border border-border/50 shadow-sm selection:bg-primary/20">
                {applicationId}
              </div>
              <p className="text-xs text-muted-foreground/80 mt-4 leading-normal font-medium">
                Please save this token. Use it to track progress on your dashboard.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 print:hidden">
            <Button 
              onClick={handlePrint} 
              className="w-full bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 transition-all duration-200 font-semibold text-xs" 
              size="lg"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print / Save Receipt PDF
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              className="w-full border-border/80 hover:bg-secondary rounded-xl h-11 transition-all duration-200 text-xs font-semibold text-muted-foreground hover:text-foreground" 
              size="lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer copyright spacer */}
      <div className="py-4 text-center text-[10px] text-muted-foreground border-t border-border/10 bg-card/10 backdrop-blur-sm print:hidden">
        &copy; {new Date().getFullYear()} MP Online Hub. All rights reserved.
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
