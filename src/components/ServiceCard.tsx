import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock, Star } from "lucide-react";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  category: string;
  isPopular?: boolean;
  onSelect: (id: string) => void;
}

export function ServiceCard({
  id,
  title,
  description,
  price,
  estimatedTime,
  category,
  isPopular = false,
  onSelect,
}: ServiceCardProps) {
  return (
    <Card className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {isPopular && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-warning text-warning-foreground">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs">
              {category}
            </Badge>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {estimatedTime}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₹{price}</div>
            <div className="text-xs text-muted-foreground">All inclusive</div>
          </div>
        </div>

        <Button 
          onClick={() => onSelect(id)}
          className="w-full group-hover:bg-primary-hover transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}