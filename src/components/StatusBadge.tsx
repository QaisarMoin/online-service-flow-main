import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle, FileText } from "lucide-react";

export type ServiceStatus = "pending" | "processing" | "completed" | "rejected" | "submitted";

interface StatusBadgeProps {
  status: ServiceStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className: "bg-status-pending text-white",
  },
  processing: {
    label: "Processing",
    icon: FileText,
    className: "bg-status-processing text-white",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-status-completed text-white",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-status-rejected text-white",
  },
  submitted: {
    label: "Submitted",
    icon: AlertCircle,
    className: "bg-muted text-foreground",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className || ""}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}