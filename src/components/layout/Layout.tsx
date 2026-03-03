import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Settings, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "transactions" | "analytics" | "setup";
  onTabChange: (tab: "transactions" | "analytics" | "setup") => void;
  onAddTransaction?: () => void;
}

export function Layout({ children, activeTab, onTabChange, onAddTransaction }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 h-screen overflow-y-auto pb-24 scrollbar-hide">
        <div className="max-w-md mx-auto min-h-full p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-between relative">
          
          <NavButton
            isActive={activeTab === "transactions"}
            onClick={() => onTabChange("transactions")}
            icon={<LayoutDashboard size={20} />}
            label="Daily"
          />

          <NavButton
            isActive={activeTab === "analytics"}
            onClick={() => onTabChange("analytics")}
            icon={<BarChart3 size={20} />}
            label="Insights"
          />

          <div className="relative -top-6">
             <Button 
                size="icon" 
                className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border-4 border-slate-950 transition-all duration-300 hover:scale-105"
                onClick={onAddTransaction}
             >
                <Plus size={28} className="text-white" />
             </Button>
          </div>

          <NavButton
            isActive={activeTab === "setup"}
            onClick={() => onTabChange("setup")}
            icon={<Settings size={20} />}
            label="Setup"
          />
          
        </div>
      </div>
    </div>
  );
}

function NavButton({ isActive, onClick, icon, label }: { isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 relative",
        isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
      )}
    >
      <div className={cn("relative z-10 transition-transform duration-200", isActive && "scale-110")}>
        {icon}
      </div>
      <span className="text-[10px] font-medium mt-1">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/5 rounded-xl border border-white/5"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
