import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/users/login", data),
    onSuccess: (data) => {
      // Security check: Only allow admin/super_admin roles
      if (data.role !== "admin" && data.role !== "super_admin") {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have administrative privileges.",
        });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      toast({
        title: "Welcome Admin",
        description: "Successfully logged into the admin portal.",
      });
      navigate("/admin");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-slate-950 dark:via-background dark:to-background flex flex-col justify-between">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Glow Blobs */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] relative z-10">
          <CardHeader className="space-y-2 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your credentials to access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@example.com" 
                  required 
                  className="rounded-xl border-border/60 focus-visible:ring-primary/25 h-10.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  required 
                  className="rounded-xl border-border/60 focus-visible:ring-primary/25 h-10.5 text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="pb-8">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 transition-all duration-200" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Footer copyright spacer */}
      <div className="py-4 text-center text-[10px] text-muted-foreground border-t border-border/10 bg-card/10 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} MP Online Hub. All rights reserved.
      </div>
    </div>
  );
}
