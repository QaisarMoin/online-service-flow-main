import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Since I might not have Dialog properly configured in UI folder, I'll check first.
// Actually, I'll just use a simple Card-based overlay or ensure Dialog exists.

export function RequestDetailModal({ request, isOpen, onClose }) {
  if (!request) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{request.service?.title}</h2>
            <p className="text-muted-foreground text-sm">Request ID: {request._id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Customer</p>
                <p>{request.customer?.name}</p>
                <p className="text-sm text-muted-foreground">{request.customer?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Status</p>
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold mb-3">Submitted Form Data</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-accent/30 p-4 rounded-lg">
                {Object.entries(request.formData || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="font-medium">{typeof value === 'object' ? 'File/Complex Data' : value}</p>
                  </div>
                ))}
              </div>
            </div>

            {request.documents && request.documents.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-3">Attachments</p>
                <div className="space-y-2">
                  {request.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{doc.fileName || doc.fieldName}</span>
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-xs font-bold hover:underline"
                      >
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

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
