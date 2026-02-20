"use client"

import type { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  badge?: number | null
  beta?: boolean
  comingSoon?: boolean
}

export function SidebarItem({ icon: Icon, label, active = false, onClick, badge = null, beta = false, comingSoon = false }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
        active ? "text-emerald-400" : "text-zinc-400 hover:text-white"
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-emerald-500/10 border-r-2 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" />
      )}
      <div className="flex items-center gap-3 relative z-10">
        <Icon size={20} className={active ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300"} />
        <span className="text-sm font-semibold tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2 relative z-10">
        {comingSoon && (
          <span className="bg-emerald-500/15 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">Soon</span>
        )}
        {beta && (
          <span className="bg-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-orange-500/30">BETA</span>
        )}
        {badge !== null && (
          <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/20">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
