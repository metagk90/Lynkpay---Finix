"use client"

import { useState } from "react"
import { PlayCircle, Info } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function VideoSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [videoUrl, setVideoUrl] = useState(block.videoUrl || "")
  const [platform, setPlatform] = useState<"youtube" | "tiktok" | "instagram" | "other">("youtube")
  const [autoplay, setAutoplay] = useState(false)
  const [loop, setLoop] = useState(false)
  const [showTitle, setShowTitle] = useState(true)

  return (
    <SettingsShell title="Edit Video" tabs={["Content"]} onClose={onClose} onSave={() => onUpdate({ ...block, title, videoUrl, description: block.description })}>
      {() => (
        <div className="max-w-xl space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Video</h3>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Platform</label>
              <div className="flex flex-wrap gap-2">
                {(["youtube", "tiktok", "instagram", "other"] as const).map((p) => (
                  <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${platform === p ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
                    {p === "youtube" ? "YouTube" : p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "Other"}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Video URL</label>
              <div className="relative">
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder={`Paste ${platform} video link...`} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                <PlayCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            {/* Preview */}
            {videoUrl && (
              <div className="w-full aspect-video rounded-xl bg-zinc-800/60 border border-zinc-800 flex items-center justify-center">
                <PlayCircle size={40} className="text-zinc-600" />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Options</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-400">Show title</span><Info size={12} className="text-zinc-600" /></div>
              <Toggle value={showTitle} onChange={setShowTitle} />
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-400">Autoplay</span><Info size={12} className="text-zinc-600" /></div>
              <Toggle value={autoplay} onChange={setAutoplay} />
            </div>
            <div className="w-full h-px bg-zinc-800" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Loop</span>
              <Toggle value={loop} onChange={setLoop} />
            </div>
          </div>
        </div>
      )}
    </SettingsShell>
  )
}
