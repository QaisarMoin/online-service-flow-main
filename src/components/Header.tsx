import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, MapPin, Clock, User, Shield } from "lucide-react";

interface HeaderProps {
  isAdmin?: boolean;
  onAdminToggle?: () => void;
}

export function Header({ isAdmin = false, onAdminToggle }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MP Online Hub</h1>
                <p className="text-sm text-muted-foreground">Digital Service Center</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 99999 88888</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Jabalpur, MP</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>9 AM - 7 PM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isAdmin && (
              <Badge variant="outline" className="hidden sm:flex">
                <Shield className="w-3 h-3 mr-1" />
                Trusted Partner
              </Badge>
            )}
            
            {onAdminToggle && (
              <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                onClick={onAdminToggle}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>{isAdmin ? "Admin Panel" : "Admin Login"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}