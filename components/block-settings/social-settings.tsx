"use client"

import { useState } from "react"
import { Plus, X, GripVertical } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

type SocialLink = { id: number; platform: string; url: string }

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function SocialSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [showLabels, setShowLabels] = useState(false)
  const [iconStyle, setIconStyle] = useState<"filled" | "outlined" | "rounded">("filled")
  const [links, setLinks] = useState<SocialLink[]>(
    block.socials?.map((s, i) => ({ id: i + 1, platform: s.platform, url: s.url })) || [
      { id: 1, platform: "Instagram", url: "https://instagram.com/" },
      { id: 2, platform: "TikTok", url: "https://tiktok.com/@" },
      { id: 3, platform: "YouTube", url: "https://youtube.com/@" },
    ]
  )

  const platforms = ["Instagram", "TikTok", "YouTube", "Twitter / X", "Facebook", "LinkedIn", "Telegram", "WhatsApp", "Spotify", "Discord", "Threads", "Pinterest"]

  const addLink = () => {
    setLinks([...links, { id: Date.now(), platform: "Instagram", url: "" }])
  }

  const removeLink = (id: number) => {
    setLinks(links.filter((l) => l.id !== id))
  }

  const updateLink = (id: number, field: "platform" | "url", value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  return (
    <SettingsShell title="Edit Social Connect" tabs={["Content"]} onClose={onClose} onSave={() => onUpdate({ ...block, title, socials: links.map((l) => ({ platform: l.platform, url: l.url })) })}>
      {() => (
        <div className="max-w-xl space-y-6">
          {/* Style */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Display</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Icon Style</label>
              <div className="flex gap-2">
                {(["filled", "outlined", "rounded"] as const).map((s) => (
                  <button key={s} onClick={() => setIconStyle(s)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${iconStyle === s ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Show labels</span>
              <Toggle value={showLabels} onChange={setShowLabels} />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Social Links</h3>
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-zinc-800/50">
                  <GripVertical size={14} className="text-zinc-700 cursor-grab shrink-0" />
                  <select value={link.platform} onChange={(e) => updateLink(link.id, "platform", e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500/50 w-32 shrink-0">
                    {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="text" value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} placeholder="Profile URL" className="flex-1 bg-transparent border-none text-sm text-zinc-300 focus:outline-none placeholder:text-zinc-700" />
                  <button onClick={() => removeLink(link.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"><X size={14} /></button>
                </div>
              ))}
            </div>
            <button onClick={addLink} className="w-full flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:text-emerald-300 transition-colors py-2">
              <Plus size={14} /> Add Social Link
            </button>
          </div>
        </div>
      )}
    </SettingsShell>
  )
}
