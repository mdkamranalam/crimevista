import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { api, type IncidentItem } from "@/lib/api";
import { IncidentDetailModal } from "./IncidentDetailModal";

export function ActivityTable() {
  const [items, setItems] = useState<IncidentItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(18472);
  const [search, setSearch] = useState<string>("");
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);

  useEffect(() => {
    api.getIncidents({ limit: 8, district: search || undefined }).then((data) => {
      if (data && data.items) {
        setItems(data.items);
        setTotalCount(data.count || 18472);
      }
    });
  }, [search]);

  const toneForStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("solved") || s.includes("closed")) return "text-success bg-success/15";
    if (s.includes("investigation")) return "text-warning bg-warning/15";
    return "text-info bg-info/15";
  };

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <h2 className="text-[15px] font-semibold">Recent FIR Activity</h2>
          <p className="text-[11.5px] text-secondary mt-0.5">
            Live feed from all Karnataka district stations
          </p>
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            placeholder="Search district or police station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-navy-card border hairline rounded-md h-9 pl-8 pr-3 text-[12px] w-[240px] placeholder:text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary/60"
          />
        </div>
        <button className="h-9 px-3 panel-inset text-[12px] flex items-center gap-1.5 hover:text-primary">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
        <button className="h-9 px-3 gold-chip rounded-md text-[12px] font-semibold flex items-center gap-1.5 hover:brightness-110">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[12.5px] min-w-[720px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wider text-secondary border-b hairline">
              <th className="py-2.5 pr-3 font-semibold">FIR No.</th>
              <th className="py-2.5 pr-3 font-semibold">Date</th>
              <th className="py-2.5 pr-3 font-semibold">Crime Type</th>
              <th className="py-2.5 pr-3 font-semibold">Location</th>
              <th className="py-2.5 pr-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelectedIncident(r)}
                className="border-b hairline last:border-b-0 hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <td className="py-3 pr-3 font-mono text-[11.5px]">{r.case_number || r.id.slice(0, 8)}</td>
                <td className="py-3 pr-3 text-secondary">{r.date_time ? new Date(r.date_time).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Today"}</td>
                <td className="py-3 pr-3 font-medium">{r.crime_type || "General Case"}</td>
                <td className="py-3 pr-3 text-secondary">{r.police_station ? `${r.police_station}, ${r.district}` : r.district}</td>
                <td className="py-3 pr-3">
                  <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded ${toneForStatus(r.status)}`}>
                    {r.status || "Under Investigation"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-[11.5px] text-secondary">
        <div>Showing 1–{items.length} of {totalCount.toLocaleString()} records</div>
        <div className="flex gap-1">
          {["Prev", "1", "2", "3", "Next"].map((p) => (
            <button
              key={p}
              className="h-7 min-w-7 px-2 panel-inset text-[11px] hover:text-primary"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      {selectedIncident && (
        <IncidentDetailModal 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      )}
    </div>
  );
}
