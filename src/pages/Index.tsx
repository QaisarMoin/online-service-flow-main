import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Shield, Clock, Star, Users } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { Header } from "@/components/Header";
import { services } from "@/data/services";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);

  const categories = Array.from(new Set(services.map(s => s.category)));
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={isAdmin} onAdminToggle={handleAdminToggle} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Government Services Made Simple
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-primary-foreground/90">
              Access all MP Online services digitally. Upload documents, track progress, and get instant updates.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>100% Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of government services. All paperwork handled digitally with transparent pricing.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search for services (Aadhar, Income Certificate, etc.)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                className="lg:w-auto h-12 px-6"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Services
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredServices.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground text-lg">No services found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    estimatedTime={service.estimatedTime}
                    category={service.category}
                    isPopular={service.isPopular}
                    onSelect={handleServiceSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-accent py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-8">Why Choose MP Online Hub?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold">100% Secure</h4>
                <p className="text-muted-foreground">
                  Your documents and personal information are completely secure with bank-level encryption.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold">Fast Processing</h4>
                <p className="text-muted-foreground">
                  Get your government services processed faster with our streamlined digital workflow.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold">Expert Support</h4>
                <p className="text-muted-foreground">
                  Our experienced team ensures your applications are completed accurately and efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">MP Online Hub</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Your trusted digital partner for all government services in Madhya Pradesh
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>📞 +91 99999 88888</span>
              <span>📍 Jabalpur, Madhya Pradesh</span>
              <span>🕒 9 AM - 7 PM (Mon-Sat)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
