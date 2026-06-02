import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, MapPin, Clock, User, Shield, LogOut, Languages } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <header className="bg-background/70 dark:bg-background/80 backdrop-blur-lg border-b border-border/40 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(37,99,235,0.3)] transition-transform duration-300 group-hover:scale-105">
              <Building2 className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-none tracking-tight group-hover:text-primary transition-colors">
                MP Online Hub
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {t("digitalServiceCenter")}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="tel:+919999988888" className="flex items-center space-x-1.5 text-muted-foreground hover:text-primary transition-colors duration-200">
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 99999 88888</span>
            </a>
            <div className="flex items-center space-x-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Jabalpur, MP</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="border-border/60 hover:bg-secondary rounded-xl text-xs font-bold gap-1.5 h-11 px-4 transition-all"
            >
              <Languages className="w-4 h-4 text-primary" />
              <span>{language === "en" ? "English" : "हिन्दी"}</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role !== 'customer' && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin")}
                    className="border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-bold text-xs sm:text-sm h-11 px-4 transition-all"
                  >
                    {t("adminDashboard")}
                  </Button>
                )}
                <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-xl border border-border/40 h-11">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {user.name}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl font-bold text-xs sm:text-sm h-11 px-4 transition-all"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t("signOut")}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/admin/login")} 
                  title="Admin Portal"
                  className="rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary h-11 w-11 p-0 flex items-center justify-center transition-all"
                >
                  <Shield className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg rounded-xl h-11 px-5 text-xs sm:text-sm font-bold transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t("login")} / {t("register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
