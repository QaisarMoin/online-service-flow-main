import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, MapPin, Clock, User, Shield, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-hover rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                MP Online Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Digital Service Center
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 99999 88888</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Jabalpur, MP</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role !== 'customer' && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </Button>
                )}
                <span className="text-sm font-medium hidden sm:inline-block">
                  Hi, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/login")} title="Admin Portal">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button size="sm" onClick={() => navigate("/auth")}>
                  <User className="w-4 h-4 mr-2" />
                  Login / Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
