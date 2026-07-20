import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/crimevista/AppShell";
import { Panel, Chip, Btn, StatTile } from "@/components/crimevista/ui";
import { ActivityTable } from "@/components/crimevista/ActivityTable";
import { CaseDetailModal } from "@/components/crimevista/CaseDetailModal";
import { Briefcase, Filter, Plus, Search, User } from "lucide-react";
import { api, type CaseItem } from "@/lib/api";

export const Route = createFileRoute("/cases")({
  component: CasesPage,
  head: () => ({
    meta: [
      { title: "Case Management — CrimeVista" },
      { name: "description", content: "Track investigations, assignments and case progress." },
    ],
  }),
});

const CASES_FALLBACK = [
  { id: "C-3421", title: "Bengaluru vehicle theft ring", lead: "Insp. R. Sharma", team: 6, progress: 72, status: "Active", priority: "High" },
  { id: "C-3420", title: "Mysuru burglary series", lead: "SI. K. Naidu", team: 4, progress: 45, status: "Active", priority: "Medium" },
  { id: "C-3419", title: "Hubli cyber fraud syndicate", lead: "Insp. A. Iyer", team: 8, progress: 88, status: "Closing", priority: "Critical" },
  { id: "C-3418", title: "Ballari narcotics network", lead: "DySP. M. Rao", team: 10, progress: 32, status: "Active", priority: "Critical" },
  { id: "C-3417", title: "Mangaluru port smuggling", lead: "Insp. V. Shetty", team: 5, progress: 60, status: "Active", priority: "High" },
  { id: "C-3416", title: "Shivamogga kidnapping", lead: "DySP. L. Kumar", team: 7, progress: 22, status: "Active", priority: "Critical" },
];

const prTone = (p: string) => p === "Critical" ? "danger" : p === "High" ? "warning" : "info";

function CasesPage() {
  const [cases, setCases] = useState<Array<{ id: string; title: string; lead: string; team: number; progress: number; status: string; priority: string }>>(CASES_FALLBACK);
  const [search, setSearch] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  useEffect(() => {
    api.getCases().then((data) => {
      if (data && data.cases && data.cases.length > 0) {
        const mapped = data.cases.map((c, idx) => ({
          id: c.case_number || `C-${3421 - idx}`,
          title: c.title || `${c.district} ${c.crime_type || "Investigation"}`,
          lead: c.lead_officer || "Insp. R. Sharma",
          team: c.team_size || Math.max(3, 8 - idx),
          progress: c.progress || Math.min(95, 30 + idx * 12),
          status: c.status || "Active",
          priority: c.priority || (idx % 2 === 0 ? "High" : "Medium")
        }));
        setCases(mapped);
      }
    });
  }, []);

  const filteredCases = cases.filter(c =>
    !search ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.lead.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Case Management" subtitle="Investigations, teams and progress">
      <PageHeader
        title="Case Management"
        description="1,482 active investigations · 6 zones · 218 lead officers"
        actions={
          <>
            <Btn variant="outline" icon={Filter}>Filters</Btn>
            <Btn icon={Plus}>New Case</Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatTile label="Active" value="1,482" tone="warning" />
        <StatTile label="Closing" value="164" tone="info" />
        <StatTile label="Closed (30d)" value="892" tone="success" />
        <StatTile label="Overdue" value="37" tone="danger" />
      </div>

      <Panel title="Case Board" subtitle="Ranked by priority and progress" action={<Chip tone="gold">Live</Chip>}>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              placeholder="Search case, lead, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full panel-inset pl-9 pr-3 h-9 text-[12.5px] rounded-md focus:outline-none focus:ring-1 focus:ring-primary/60"
            />
          </div>
          {["Priority", "Zone", "Status"].map((f) => (
            <Btn key={f} variant="outline" icon={Filter}>{f}</Btn>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredCases.map((c) => (
            <div key={c.id} className="panel-inset p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-primary">{c.id}</div>
                  <div className="text-[13.5px] font-semibold mt-0.5 leading-tight">{c.title}</div>
                </div>
                <Chip tone={prTone(c.priority) as never}>{c.priority}</Chip>
              </div>
              <div className="flex items-center gap-2 text-[11.5px] text-secondary">
                <User className="w-3.5 h-3.5" /> {c.lead}
                <span className="opacity-40">·</span>
                <Briefcase className="w-3.5 h-3.5" /> {c.team} officers
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
                  <span>Progress</span>
                  <span className="font-mono">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Chip>{c.status}</Chip>
                <Btn variant="outline" onClick={() => setSelectedCase(c)}>Open</Btn>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <ActivityTable />

      {selectedCase && (
        <CaseDetailModal 
          caseItem={selectedCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </AppShell>
  );
}
