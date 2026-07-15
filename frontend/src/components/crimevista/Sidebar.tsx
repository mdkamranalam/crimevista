import {
  LayoutDashboard,
  Map,
  FileSearch,
  Network,
  Brain,
  FileBarChart2,
  ShieldCheck,
  LogOut,
  ShieldAlert,
  CircleDot,
  Settings,
  X,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

import kspLogo from "../../assets/ksp-logo.png";
import vidhanaSoudha from "../../assets/vidhana-soudha.png";

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  badge?: string;
};

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Intelligence Brief", to: "/" },
  { icon: FileSearch, label: "FIR Intelligence", to: "/fir" },
  { icon: Map, label: "Crime Heatmap", to: "/heatmap" },
  { icon: Network, label: "Relationship Intelligence", to: "/relationships" },
  { icon: Brain, label: "Predictive Analytics", to: "/predictive" },
  {
    icon: ShieldAlert,
    label: "Alerts & Notifications",
    to: "/alerts",
    badge: "12",
  },
  { icon: FileBarChart2, label: "Reports & Analytics", to: "/reports" },
  { icon: ShieldCheck, label: "Case Management", to: "/cases" },
  { icon: Settings, label: "Administration", to: "/admin" },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex w-[280px] shrink-0 flex-col bg-sidebar border-r hairline min-h-screen",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ==========================
            Header
        =========================== */}

        <div className="flex items-center gap-3 px-5 py-5 border-b hairline">

          <div className="w-12 h-12 rounded-lg overflow-hidden border border-primary/30 bg-white/5 flex items-center justify-center">
            <img
              src={kspLogo}
              alt="CrimeVista Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold text-[18px] tracking-tight leading-tight truncate">
              Crime
              <span className="text-primary">Vista</span>
            </div>

            <div className="text-[10px] uppercase tracking-[0.18em] text-secondary leading-tight mt-0.5">
              AI Crime Intelligence Platform
            </div>

            <div className="text-[10px] text-secondary/70 leading-tight">
              Government of Karnataka
            </div>
          </div>

          <button
            className="lg:hidden text-secondary hover:text-foreground"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* ==========================
            Navigation
        =========================== */}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV.map((item) => {
            const active = path === item.to;

            return (
              <Link
                key={item.label}
                to={item.to as never}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:translate-x-0.5"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />

                <span className="flex-1 truncate">{item.label}</span>

                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded",
                      active
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "bg-destructive/25 text-destructive-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ==========================
            Footer
        =========================== */}

        <div className="border-t hairline p-3 space-y-2">

          {/* Language */}

          <div className="panel-inset flex items-center gap-2 px-3 py-2 text-[11.5px]">
            <select className="flex-1 bg-transparent outline-none text-secondary">
              <option className="bg-navy-card">🌐 English</option>
              <option className="bg-navy-card">ಕನ್ನಡ</option>
              <option className="bg-navy-card">हिन्दी</option>
            </select>
          </div>

          {/* Branding */}

          <div className="panel-inset px-3 py-3">

            <div className="flex items-center gap-2 text-[11.5px] font-semibold">
              <CircleDot className="w-3.5 h-3.5 text-primary" />
              Secure. Intelligent. Effective.
            </div>

            <div className="mt-3 flex justify-center">
              <img
                src={vidhanaSoudha}
                alt="Vidhana Soudha"
                className="w-full max-w-[180px] object-contain opacity-30"
              />
            </div>

            <div className="text-[10.5px] text-secondary mt-2 text-center">
              Building a Safer Karnataka with AI
            </div>

          </div>

          {/* Logout */}

          <Link
            to="/login"
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-secondary hover:text-foreground rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />

            Logout

            <span className="ml-auto font-mono text-[10px] opacity-60">
              v2.4.1
            </span>
          </Link>

        </div>

      </aside>
    </>
  );
}