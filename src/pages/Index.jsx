import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Shield, Clock, Star, Users } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { Header } from "@/components/Header";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const { t, language } = useTranslation();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services"),
  });

  const categories = Array.from(new Set(services.map((s) => language === 'hi' && s.categoryHindi ? s.categoryHindi : s.category)));
  const filteredServices = services.filter((service) => {
    const sTitle = language === 'hi' && service.titleHindi ? service.titleHindi : service.title;
    const sDesc = language === 'hi' && service.descriptionHindi ? service.descriptionHindi : service.description;
    const sCat = language === 'hi' && service.categoryHindi ? service.categoryHindi : service.category;

    const matchesSearch =
      (sTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sDesc || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || sCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('Filtered Services:', filteredServices);

  const handleServiceSelect = (serviceId) => {
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
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-background to-background dark:from-slate-950 dark:via-background dark:to-background py-20 lg:py-24 border-b border-border/30">
        {/* Glow Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-60 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-none font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full mb-6">
              ⚡ {language === 'hi' ? "सुरक्षित और विश्वसनीय डिजिटल पोर्टल" : "Safe & Secure Digital Portal"}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
              {language === 'hi' ? (
                <>
                  सरकारी सेवाएं <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    हुईं आसान
                  </span>
                </>
              ) : (
                <>
                  Government Services <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>


            {/* Trust Pill Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground mt-4">
              <div className="flex items-center gap-1.5 bg-card border border-border/40 px-3 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>{language === 'hi' ? "100% सुरक्षित और विश्वसनीय" : "100% Secure & Trusted"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card border border-border/40 px-3 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{t("badgeFast")}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card border border-border/40 px-3 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>{language === 'hi' ? "विशेषज्ञ सहायता" : "Expert Support"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
              {language === 'hi' ? "हमारी सेवाओं का अन्वेषण करें" : "Explore Our Services"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {language === 'hi' 
                ? "एक सेवा चुनें, आवश्यकताओं को भरें और अपने दस्तावेज़ अपलोड करें। हम सभी प्रसंस्करण को पारदर्शी रूप से संभालते हैं।" 
                : "Select a service, fill in the requirements, and upload your documents. We take care of all processing transparently."}
            </p>
          </div>

          {/* Category Filters */}
          <div className="max-w-4xl mx-auto mb-10 flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-6 text-xs sm:text-sm font-semibold h-11 transition-all duration-200 ${
                selectedCategory === "all" 
                  ? "bg-primary text-white shadow-md hover:bg-primary-hover shadow-primary/20" 
                  : "border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("allServices")}
            </Button>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 text-xs sm:text-sm font-semibold h-11 transition-all duration-200 ${
                    isSelected 
                      ? "bg-primary text-white shadow-md hover:bg-primary-hover shadow-primary/20" 
                      : "border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </Button>
              );
            })}

            
          </div>
          {/* Search Input Container */}
            <div className="max-w-xl mx-auto bg-card border border-border/60 dark:border-slate-800 p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.08)] focus-within:border-primary/40 transition-all duration-300 flex items-center mb-8">
              <div className="pl-3.5 text-muted-foreground">
                <Search className="w-5 h-5 text-primary/70" />
              </div>
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 text-sm h-11 bg-transparent py-0 flex-1 px-3"
              />
            
            </div>

          {/* Services Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredServices.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-border/80 rounded-2xl bg-card">
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    {language === 'hi' ? "आपकी खोज से मेल खाने वाली कोई सेवा नहीं मिली।" : "No services found matching your search."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="rounded-xl text-xs px-4"
                  >
                    {language === 'hi' ? "फ़िल्टर हटाएं" : "Clear Filters"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    id={service._id}
                    title={language === 'hi' && service.titleHindi ? service.titleHindi : service.title}
                    description={language === 'hi' && service.descriptionHindi ? service.descriptionHindi : service.description}
                    price={service.price}
                    estimatedTime={service.estimatedTime}
                    category={language === 'hi' && service.categoryHindi ? service.categoryHindi : service.category}
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
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-border/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-12">
              {language === 'hi' ? "एमपी ऑनलाइन हब क्यों चुनें?" : "Why Choose MP Online Hub?"}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border/40 p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300 text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">{language === 'hi' ? "100% सुरक्षित" : "100% Secure"}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'hi' 
                    ? "आपके दस्तावेज़ और व्यक्तिगत जानकारी एन्क्रिप्टेड और उच्चतम सुरक्षा के साथ संभाली जाती है।" 
                    : "Your documents and personal information are encrypted and handled with the highest security."}
                </p>
              </div>
              
              <div className="bg-card border border-border/40 p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300 text-center">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center mx-auto mb-5 text-blue-600 dark:text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">{t("badgeFast")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'hi' 
                    ? "लंबी कतारों से बचें। हमारे सीधे चैनलों के माध्यम से आपके आवेदनों को तेजी से संसाधित किया जाता है।" 
                    : "Avoid long queues. Get your applications processed rapidly through our direct channels."}
                </p>
              </div>

              <div className="bg-card border border-border/40 p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-300 text-center">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center mx-auto mb-5 text-indigo-600 dark:text-indigo-400">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">{language === 'hi' ? "विशेषज्ञ सहायता" : "Expert Assistance"}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'hi' 
                    ? "हमारा पेशेवर सेवा डेस्क त्रुटियों को रोकने और अनुमोदन सुनिश्चित करने के लिए हर आवेदन का ऑडिट करता है।" 
                    : "Our professional service desk audits every application to prevent errors and ensure approval."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2.5 mb-5">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <h3 className="text-base font-bold text-foreground tracking-tight">MP Online Hub</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-8">
              {language === 'hi' 
                ? "सभी सरकारी आवेदनों, प्रमाणपत्रों और डिजिटल सेवाओं के लिए आपका विश्वसनीय साथी।" 
                : "Your trusted partner for all government applications, certificates, and digital services."}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground font-medium border-t border-border/30 pt-6 max-w-md mx-auto">
              <span className="hover:text-primary transition-colors cursor-pointer">📞 +91 99999 88888</span>
              <span className="hover:text-primary transition-colors cursor-pointer">📍 Jabalpur, MP</span>
              <span className="hover:text-primary transition-colors cursor-pointer">{language === 'hi' ? "🕒 सुबह 9 - शाम 7 (सोम-शनि)" : "🕒 9 AM - 7 PM (Mon-Sat)"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
