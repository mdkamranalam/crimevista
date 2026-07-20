import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/crimevista/AppShell";
import { Panel, StatTile } from "@/components/crimevista/ui";
import { HeatmapPanel } from "@/components/crimevista/HeatmapPanel";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, type RiskItem } from "@/lib/api";

export const Route = createFileRoute("/district")({
  component: DistrictPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      name: (search.name as string) || "Bengaluru Urban",
    };
  },
});

function DistrictPage() {
  const { name } = Route.useSearch();
  const [districtData, setDistrictData] = useState<RiskItem | null>(null);

  useEffect(() => {
    api.getRiskScores().then((data) => {
      const found = data.items.find((d) => d.district.toLowerCase() === name.toLowerCase());
      if (found) setDistrictData(found);
    });
  }, [name]);

  const TREND = Array.from({ length: 30 }, (_, i) => ({
    d: `Day ${i + 1}`,
    v: 50 + Math.round(Math.sin(i / 3) * 15 + (i * 0.5)),
  }));

  const toneForRisk = (risk: string) => 
    risk === "High Risk" ? "danger" : risk === "Medium Risk" ? "warning" : "success";

  return (
    <AppShell title={`${name} Overview`} subtitle="District level crime trends and analytics">
      <PageHeader
        title={`${name} Overview`}
        description={districtData?.reason || "Fetching district performance data..."}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatTile 
          label="Total Incidents" 
          value={districtData ? districtData.incident_count.toLocaleString() : "..."} 
          tone="info" 
        />
        <StatTile 
          label="Risk Assessment" 
          value={districtData?.risk_category || "..."} 
          tone={districtData ? toneForRisk(districtData.risk_category) as any : "default"} 
        />
        <StatTile label="Active Hotspots" value="3" tone="warning" />
        <StatTile label="Clearance Rate" value="42%" tone="success" />
      </div>

      <Panel title="30-Day Crime Volume Trend" subtitle={`Incident logging rate for ${name}`}>
        <div className="h-[240px]">
          <ResponsiveContainer>
            <AreaChart data={TREND} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: "oklch(1 0 0 / 0.5)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(1 0 0 / 0.5)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-navy-elev)", border: "1px solid var(--color-hairline)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 md:gap-5 mt-4 md:mt-5">
        <HeatmapPanel />
      </div>
    </AppShell>
  );
}
