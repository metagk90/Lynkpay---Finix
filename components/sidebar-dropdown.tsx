"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { ChevronDown, AlertTriangle as WarningIcon } from "lucide-react"

interface DropdownChild {
  icon: LucideIcon
  label: string
  badge?: number | null
  warning?: boolean
}

interface SidebarDropdownProps {
  icon: LucideIcon
  label: string
  children: DropdownChild[]
  activeTab: string
  onSelect: (label: string) => void
}

export function SidebarDropdown({ icon: Icon, label, children, activeTab, onSelect }: SidebarDropdownProps) {
  const isChildActive = children.some((c) => activeTab === c.label)
  const [open, setOpen] = useState(isChildActive)

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
          isChildActive ? "text-emerald-400" : "text-zinc-400 hover:text-white"
        }`}
      >
        {isChildActive && (
          <div className="absolute inset-0 bg-emerald-500/10 border-r-2 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" />
        )}
        <div className="flex items-center gap-3 relative z-10">
          <Icon
            size={20}
            className={
              isChildActive
                ? "text-emerald-400"
                : "text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300"
            }
          />
          <span className="text-sm font-semibold tracking-wide">{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`relative z-10 transition-transform duration-300 ${open ? "rotate-180" : ""} ${
            isChildActive ? "text-emerald-400" : "text-zinc-600"
          }`}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-4 border-l border-zinc-800/60 pl-2 mt-1 flex flex-col gap-0.5">
          {children.map((child) => {
            const active = activeTab === child.label
            return (
              <div
                key={child.label}
                onClick={() => onSelect(child.label)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  active ? "text-emerald-400 bg-emerald-500/5" : "text-zinc-500 hover:text-white hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <child.icon
                    size={16}
                    className={active ? "text-emerald-400" : "text-zinc-600"}
                  />
                  <span className="text-[13px] font-medium">{child.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {child.warning && (
                    <WarningIcon size={14} className="text-amber-400 animate-pulse" />
                  )}
                  {child.badge !== undefined && child.badge !== null && (
                    <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/20">
                      {child.badge}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
