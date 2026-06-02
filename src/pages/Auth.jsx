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

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data) => api.post(isLogin ? "/users/login" : "/users", data),
    onSuccess: (data) => {
      if (data.role === "admin" || data.role === "super_admin") {
        toast({
          variant: "destructive",
          title: "Wrong Portal",
          description: "Admins must login via the /admin/login portal.",
        });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: "Successfully logged in.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
      
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
        {/* Glow Blobs */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

        <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] relative z-10">
          <CardHeader className="space-y-2 pt-8 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground text-center">
              {isLogin 
                ? "Enter your credentials to access your digital services" 
                : "Create a new account to apply and track services"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pb-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    required 
                    className="rounded-xl border-border/60 focus-visible:ring-primary/25 h-10.5 text-sm"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com" 
                  required 
                  className="rounded-xl border-border/60 focus-visible:ring-primary/25 h-10.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
                </div>
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
            <CardFooter className="flex flex-col gap-3 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 transition-all duration-200" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : (isLogin ? "Sign In" : "Get Started")}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl py-2"
              >
                {isLogin ? "New user? Create an account" : "Already have an account? Sign In"}
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
