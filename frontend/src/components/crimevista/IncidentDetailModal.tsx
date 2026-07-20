import { useState, useEffect } from "react";
import { X, Network, FileText, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { Chip, Btn } from "./ui";
import { Skeleton } from "./ui/Skeleton";
import { api, type IncidentItem, type NetworkAnalysisResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

export function IncidentDetailModal({
  incident,
  onClose,
}: {
  incident: IncidentItem | null;
  onClose: () => void;
}) {
  const [network, setNetwork] = useState<NetworkAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incident) {
      setLoading(true);
      setNetwork(null);
      // We use case_number as entityId, fallback to id if needed
      const entityId = incident.case_number || incident.id;
      api.getNetworkAnalysis(entityId).then((data) => {
        setNetwork(data);
        setLoading(false);
      });
    }
  }, [incident]);

  if (!incident) return null;

  const priorityTone = (p: string) =>
    p === "Critical" ? "danger" : p === "High" ? "warning" : p === "Medium" ? "info" : "success";

  const statusTone = (s: string) =>
    s === "Closed" || s === "Solved" ? "success" : s === "Under Investigation" ? "warning" : s === "Forwarded" ? "info" : "default";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="panel w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {incident.case_number || "Unknown Case"}
              </h2>
              <Chip tone={priorityTone(incident.severity) as never}>{incident.severity}</Chip>
              <Chip tone={statusTone(incident.status) as never}>{incident.status}</Chip>
            </div>
            <p className="text-sm text-secondary flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              {incident.crime_type}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> District</div>
              <div className="text-sm font-medium">{incident.district}</div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Station</div>
              <div className="text-sm font-medium">{incident.police_station || "Unknown"}</div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Date & Time</div>
              <div className="text-sm font-medium">
                {incident.date_time ? new Date(incident.date_time).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A"}
              </div>
            </div>
            <div className="panel-inset p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-secondary flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Location</div>
              <div className="text-sm font-medium truncate" title={incident.location_name}>{incident.location_name || "Unknown"}</div>
            </div>
          </div>

          {/* Network Analysis Section */}
          <div className="space-y-3">
            <h3 className="text-[13.5px] font-semibold flex items-center gap-2 text-primary">
              <Network className="w-4 h-4" /> Connected Network Entities
            </h3>
            
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : network && network.nodes.length > 1 ? (
              <div className="panel-inset p-4">
                <ul className="space-y-3">
                  {network.edges.map((edge, idx) => {
                    const sourceNode = network.nodes.find(n => n.id === edge.source);
                    const targetNode = network.nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    return (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="font-semibold px-2 py-0.5 rounded bg-white/5">{sourceNode.label}</span>
                        <span className="text-[10px] text-secondary uppercase tracking-widest px-2">{edge.type.replace(/_/g, " ")}</span>
                        <span className="font-semibold px-2 py-0.5 rounded bg-white/5">{targetNode.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="panel-inset p-4 text-center text-sm text-secondary">
                No advanced network connections found for this incident.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3">
          <Btn variant="outline" onClick={onClose}>Close</Btn>
          <Btn variant="primary">View Full Case File</Btn>
        </div>
      </div>
    </div>
  );
}
