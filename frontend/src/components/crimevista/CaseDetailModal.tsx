import { X, Briefcase, User, Calendar, ShieldAlert } from "lucide-react";
import { Chip, Btn } from "./ui";

export function CaseDetailModal({
  caseItem,
  onClose,
}: {
  caseItem: any;
  onClose: () => void;
}) {
  if (!caseItem) return null;

  const priorityTone = (p: string) =>
    p === "Critical" ? "danger" : p === "High" ? "warning" : "info";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {caseItem.id}
              </h2>
              <Chip tone={priorityTone(caseItem.priority) as never}>{caseItem.priority}</Chip>
              <Chip>{caseItem.status}</Chip>
            </div>
            <p className="text-sm text-secondary font-medium">
              {caseItem.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Lead Officer</div>
              <div className="text-sm font-medium">{caseItem.lead}</div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5"/> Team Size</div>
              <div className="text-sm font-medium">{caseItem.team} officers</div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Progress</div>
              <div className="text-sm font-medium">{caseItem.progress}%</div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Last Updated</div>
              <div className="text-sm font-medium">Just now</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[13.5px] font-semibold text-primary">Case Description</h3>
            <div className="panel-inset p-4 text-sm text-secondary leading-relaxed">
              Active investigation regarding {caseItem.title.toLowerCase()}. Team of {caseItem.team} officers led by {caseItem.lead} is currently analyzing connected incidents and syndicates.
              Progress stands at {caseItem.progress}%.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3">
          <Btn variant="outline" onClick={onClose}>Close</Btn>
          <Btn variant="primary">Manage Team</Btn>
        </div>
      </div>
    </div>
  );
}
