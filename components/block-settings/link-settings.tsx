"use client"

import { useState } from "react"
import { ExternalLink, Info, ImageIcon, Upload } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function LinkSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [url, setUrl] = useState("https://")
  const [showThumbnail, setShowThumbnail] = useState(false)
  const [openNewTab, setOpenNewTab] = useState(true)
  const [lockLink, setLockLink] = useState(false)
  const [prioritize, setPrioritize] = useState(false)
  const [animation, setAnimation] = useState<"none" | "shake" | "pulse" | "bounce">("none")

  return (
    <SettingsShell title="Edit Link" tabs={["Content"]} onClose={onClose} onSave={() => onUpdate({ ...block, title })}>
      {() => (
        <div className="max-w-xl space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Link Details</h3>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">URL</label>
              <div className="relative">
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Show Thumbnail</span>
                <Toggle value={showThumbnail} onChange={setShowThumbnail} />
              </div>
              {showThumbnail && (
                <button className="w-full py-10 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-colors">
                  <Upload size={18} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500 font-bold">Upload thumbnail</span>
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Options</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-400">Open in new tab</span><Info size={12} className="text-zinc-600" /></div>
              <Toggle value={openNewTab} onChange={setOpenNewTab} />
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-400">Lock link</span><Info size={12} className="text-zinc-600" /></div>
              <Toggle value={lockLink} onChange={setLockLink} />
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-400">Prioritize / Pin to top</span><Info size={12} className="text-zinc-600" /></div>
              <Toggle value={prioritize} onChange={setPrioritize} />
            </div>
          </div>

          {/* Animation */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Animation</h3>
            <div className="flex flex-wrap gap-2">
              {(["none", "shake", "pulse", "bounce"] as const).map((a) => (
                <button key={a} onClick={() => setAnimation(a)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${animation === a ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
                  {a === "none" ? "None" : a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </SettingsShell>
  )
}
