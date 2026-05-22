import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, ImageIcon, ExternalLink, Download } from "lucide-react";

// Helper: detect if a document is an image based on mime type or URL
const isImageFile = (doc) => {
  if (doc.fileType && doc.fileType.startsWith("image/")) return true;
  if (doc.fileUrl) {
    const url = doc.fileUrl.toLowerCase();
    return (
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".png") ||
      url.includes(".webp") ||
      url.includes(".gif")
    );
  }
  return false;
};

const isPdfFile = (doc) => {
  if (doc.fileType === "application/pdf") return true;
  if (doc.fileUrl) return doc.fileUrl.toLowerCase().includes(".pdf");
  return false;
};

function DocumentPreview({ doc }) {
  const isImage = isImageFile(doc);
  const isPdf = isPdfFile(doc);
  const fileName = doc.fileName || doc.fieldName || "Document";

  return (
    <div className="border rounded-lg overflow-hidden bg-accent/20 hover:bg-accent/40 transition-colors">
      {/* Image Preview */}
      {isImage && doc.fileUrl && (
        <div className="relative">
          <img
            src={doc.fileUrl}
            alt={fileName}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback if image fails to load */}
          <div
            className="hidden w-full h-40 items-center justify-center bg-muted"
            style={{ display: "none" }}
          >
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* PDF Icon placeholder */}
      {isPdf && (
        <div className="w-full h-32 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 gap-2">
          <FileText className="w-12 h-12 text-red-500" />
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">PDF Document</span>
        </div>
      )}

      {/* Unknown file type */}
      {!isImage && !isPdf && (
        <div className="w-full h-24 flex items-center justify-center bg-muted">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {/* File info + actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{doc.fieldName}</p>
            <p className="text-sm font-medium line-clamp-1" title={fileName}>
              {fileName}
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {isImage ? "Image" : isPdf ? "PDF" : "File"}
          </Badge>
        </div>

        {doc.fileUrl && (
          <div className="flex gap-2">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              {isImage ? "View Full" : "Open"}
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={doc.fileUrl}
              download={fileName}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function RequestDetailModal({ request, isOpen, onClose }) {
  if (!request) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{request.service?.title}</h2>
            <p className="text-muted-foreground text-sm">
              Request ID: {request._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="space-y-6">
            {/* Customer + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                  Customer
                </p>
                <p className="font-medium">{request.customer?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {request.customer?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                  Status
                </p>
                <StatusBadge status={request.status} />
              </div>
            </div>

            {/* Form Data */}
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold mb-3">
                Submitted Form Data
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-accent/30 p-4 rounded-lg">
                {Object.entries(request.formData || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="font-medium">
                      {typeof value === "object" ? "File/Complex Data" : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents / Attachments with preview */}
            {request.documents && request.documents.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-3">
                  Attachments ({request.documents.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {request.documents.map((doc, idx) => (
                    <DocumentPreview key={idx} doc={doc} />
                  ))}
                </div>
              </div>
            )}

            {/* No documents */}
            {(!request.documents || request.documents.length === 0) && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No documents uploaded with this request.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
