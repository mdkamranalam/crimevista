import { useState, useEffect } from "react";
import { X, Map, AlertTriangle, FileText, MapPin } from "lucide-react";
import { Chip, Btn } from "./ui";
import { Skeleton } from "./ui/Skeleton";
import { api, type IncidentItem } from "@/lib/api";

export function HotspotDetailModal({
  hotspot,
  onClose,
}: {
  hotspot: any;
  onClose: () => void;
}) {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hotspot) {
      setLoading(true);
      const districtName = hotspot.name.split(" (")[0]; // e.g. "Koramangala, Bengaluru" -> "Koramangala, Bengaluru"
      // Actually we will just use the exact district passed from the backend if available, or just fetch recent incidents for that name
      api.getIncidents({ district: districtName, limit: 10 }).then((data) => {
        setIncidents(data.items || []);
        setLoading(false);
      });
    }
  }, [hotspot]);

  if (!hotspot) return null;

  const toneForStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("solved") || s.includes("closed")) return "text-success bg-success/15";
    if (s.includes("investigation")) return "text-warning bg-warning/15";
    return "text-info bg-info/15";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Hotspot #{hotspot.rank}
              </h2>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${hotspot.tone}`}>
                {hotspot.level} Intensity
              </span>
            </div>
            <p className="text-sm text-secondary font-medium flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {hotspot.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[13.5px] font-semibold flex items-center gap-2 text-primary">
              <AlertTriangle className="w-4 h-4" /> Supporting Incidents
            </h3>
            
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : incidents.length > 0 ? (
              <div className="panel-inset p-4">
                <ul className="space-y-3">
                  {incidents.map((inc) => (
                    <li key={inc.id} className="flex flex-col md:flex-row md:items-center gap-2 text-sm justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold px-2 py-0.5 rounded bg-white/5 font-mono">{inc.case_number || inc.id.substring(0, 8)}</span>
                        <span>{inc.crime_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary">{new Date(inc.date_time).toLocaleDateString("en-IN")}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${toneForStatus(inc.status)}`}>
                          {inc.status || "Under Investigation"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="panel-inset p-4 text-center text-sm text-secondary">
                No detailed incidents found for this cluster.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3">
          <Btn variant="outline" onClick={onClose}>Close</Btn>
          <Btn variant="primary" icon={Map}>View on Full Map</Btn>
        </div>
      </div>
    </div>
  );
}
