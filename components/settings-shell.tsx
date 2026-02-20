"use client"

import { useState } from "react"

interface SettingsShellProps {
  title: string
  tabs?: string[]
  onClose: () => void
  onSave: () => void
  children: (activeTab: string) => React.ReactNode
}

export function SettingsShell({ title, tabs = ["Content", "Integrations"], onClose, onSave, children }: SettingsShellProps) {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 shadow-xl flex items-center justify-between">
        <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
        <button
          onClick={onClose}
          className="px-5 py-2 border border-emerald-500/50 text-emerald-500 rounded-2xl font-black text-xs uppercase hover:bg-emerald-500/10 transition-all"
        >
          Options
        </button>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 bg-zinc-900/60 rounded-2xl p-1 w-fit border border-zinc-800/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {children(activeTab)}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          onClick={onClose}
          className="px-10 py-3.5 border border-zinc-700 text-zinc-400 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-zinc-900/60 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-10 py-3.5 bg-emerald-500 text-black rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Update
        </button>
      </div>
    </div>
  )
}
