import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { api, type HotspotItem } from "@/lib/api";
import { HotspotDetailModal } from "./HotspotDetailModal";

const FALLBACK_HOTSPOTS = [
  { rank: 1, name: "Koramangala, Bengaluru", level: "Very High", tone: "bg-destructive/25 text-destructive" },
  { rank: 2, name: "Mysuru City", level: "High", tone: "bg-warning/25 text-warning" },
  { rank: 3, name: "Yeshwanthpur, Bengaluru", level: "High", tone: "bg-warning/25 text-warning" },
  { rank: 4, name: "Ballari City", level: "Medium", tone: "bg-info/25 text-info" },
  { rank: 5, name: "Hubli City", level: "Medium", tone: "bg-info/25 text-info" },
];

export function HeatmapPanel() {
  const [hotspots, setHotspots] = useState<Array<{ rank: number; name: string; level: string; tone: string }>>(FALLBACK_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  useEffect(() => {
    api.getHotspots().then((data) => {
      if (data && data.hotspots && data.hotspots.length > 0) {
        const mapped = data.hotspots.slice(0, 5).map((h, idx) => {
          const score = h.score || (h.incident_count / 100);
          const level = score >= 0.85 ? "Very High" : score >= 0.7 ? "High" : "Medium";
          const tone = score >= 0.85 ? "bg-destructive/25 text-destructive" : score >= 0.7 ? "bg-warning/25 text-warning" : "bg-info/25 text-info";
          return {
            rank: idx + 1,
            name: `${h.district} (${h.crime_type || "Cluster"})`,
            level,
            tone
          };
        });
        setHotspots(mapped);
      }
    });
  }, []);

  return (
    <div className="panel p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-semibold">Karnataka Crime Overview</h2>
          <p className="text-[11.5px] text-secondary mt-0.5">
            Live crime density across all districts
          </p>
        </div>
        <select className="panel-inset text-[11.5px] px-2.5 py-1.5 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4 flex-1">
        <MapCanvas />
        <div>
          <div className="text-[11.5px] uppercase tracking-wider text-secondary font-semibold mb-2">
            Top Hotspots
          </div>
          <ul className="space-y-1.5">
            {hotspots.map((h) => (
              <li
                key={h.rank}
                onClick={() => setSelectedHotspot(h)}
                className="flex items-center gap-3 panel-inset px-3 py-2.5 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded font-mono text-[11px] font-bold bg-primary/15 text-primary flex items-center justify-center">
                  {h.rank}
                </div>
                <div className="flex-1 text-[12.5px] font-medium">{h.name}</div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${h.tone}`}>
                  {h.level}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/heatmap" className="mt-3 w-full gold-chip rounded-md py-2 text-[12px] font-semibold flex items-center justify-center gap-1 hover:brightness-110 block text-center">
            View Full Heatmap <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {selectedHotspot && (
        <HotspotDetailModal 
          hotspot={selectedHotspot} 
          onClose={() => setSelectedHotspot(null)} 
        />
      )}
    </div>
  );
}

function MapCanvas() {
  // Stylised Karnataka silhouette with heatmap blobs
  const hotspots = [
    { cx: 210, cy: 300, r: 42, c: "oklch(0.66 0.22 25)" },     // Bengaluru
    { cx: 175, cy: 260, r: 32, c: "oklch(0.72 0.2 55)" },      // Mysuru
    { cx: 260, cy: 195, r: 26, c: "oklch(0.78 0.14 85)" },     // Ballari
    { cx: 155, cy: 155, r: 22, c: "oklch(0.72 0.17 155)" },    // Hubli
    { cx: 235, cy: 240, r: 20, c: "oklch(0.72 0.17 155)" },    // Tumakuru
  ];
  return (
    <div className="relative rounded-md overflow-hidden panel-inset aspect-[4/3] xl:aspect-auto min-h-[320px]">
      <svg viewBox="0 0 400 420" className="w-full h-full">
        <defs>
          {hotspots.map((h, i) => (
            <radialGradient id={`hg${i}`} key={i}>
              <stop offset="0%" stopColor={h.c} stopOpacity="0.9" />
              <stop offset="100%" stopColor={h.c} stopOpacity="0" />
            </radialGradient>
          ))}
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="oklch(1 0 0 / 0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="420" fill="url(#grid)" />
        {/* Rough Karnataka silhouette */}
        <path
          d="M90 90 L170 70 L230 90 L280 130 L300 180 L320 240 L280 300 L250 360 L200 380 L150 360 L110 320 L90 260 L70 200 L80 140 Z"
          fill="oklch(0.32 0.05 258 / 0.7)"
          stroke="oklch(0.78 0.14 85 / 0.35)"
          strokeWidth="1.2"
        />
        {hotspots.map((h, i) => (
          <g key={i}>
            <circle cx={h.cx} cy={h.cy} r={h.r} fill={`url(#hg${i})`} />
            <circle cx={h.cx} cy={h.cy} r="3" fill={h.c} />
          </g>
        ))}
        {[
          ["Belagavi", 110, 130],
          ["Hubballi", 145, 165],
          ["Dharwad", 165, 200],
          ["Ballari", 260, 190],
          ["Shivamogga", 175, 235],
          ["Tumakuru", 235, 245],
          ["Mysuru", 175, 275],
          ["Bengaluru", 220, 305],
          ["Mangaluru", 120, 300],
        ].map(([name, x, y]) => (
          <text
            key={name as string}
            x={x as number}
            y={y as number}
            fill="oklch(0.88 0.02 250)"
            fontSize="9"
            fontWeight="500"
            textAnchor="middle"
          >
            {name}
          </text>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 panel-inset px-3 py-2 space-y-1 text-[10.5px]">
        <div className="font-semibold text-secondary mb-1 uppercase tracking-wider">
          Intensity
        </div>
        {[
          ["Very High", "oklch(0.66 0.22 25)"],
          ["High", "oklch(0.72 0.2 55)"],
          ["Medium", "oklch(0.78 0.14 85)"],
          ["Low", "oklch(0.72 0.17 155)"],
        ].map(([l, c]) => (
          <div key={l} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
