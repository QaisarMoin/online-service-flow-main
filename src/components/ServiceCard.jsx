import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ServiceCard({
  id,
  title,
  description,
  price,
  estimatedTime,
  category,
  isPopular = false,
  onSelect,
}) {
  const { t } = useTranslation();

  return (
    <Card 
      onClick={() => onSelect(id)}
      className="relative group overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full"
    >
      {isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-lg border-none shadow-[0_2px_8px_rgba(245,158,11,0.25)]">
            <Star className="w-2.5 h-2.5 mr-1 fill-current" />
            {t("popularTag")}
          </Badge>
        </div>
      )}

      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2.5 text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 hover:bg-blue-50 border-none rounded-lg">
                {category}
              </Badge>
              <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 leading-snug">
                {title}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mt-1">
            {description}
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4 border-t border-border/30 pt-3">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Clock className="w-3.5 h-3.5 mr-1 text-primary/70" />
            {estimatedTime}
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-primary tracking-tight">₹{price}</div>
            <div className="text-[10px] text-muted-foreground font-medium">{t("allInclusive")}</div>
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className="w-full bg-primary hover:bg-primary-hover text-white shadow-sm rounded-xl py-4 transition-all duration-200 group/btn"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="text-xs font-semibold">{t("viewDetails")}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
