"use client"

import { useState, useRef } from "react"
import { Upload, ImageIcon, X, Plus, Info, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function ImageSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [image, setImage] = useState(block.image || "")
  const [altText, setAltText] = useState(block.description || "")
  const [linkUrl, setLinkUrl] = useState(block.url || "")
  const [addLink, setAddLink] = useState(!!block.url)
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center")
  const [rounded, setRounded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
    }
  }

  return (
    <SettingsShell title="Edit Image" tabs={["Content"]} onClose={onClose} onSave={() => onUpdate({ ...block, title, image: image || block.image, url: linkUrl || block.url, description: altText || block.description })}>
      {() => (
        <div className="max-w-xl space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Image</h3>

            {/* Upload Area */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            {image ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={altText || "Uploaded image"} className="w-full max-h-64 object-cover" crossOrigin="anonymous" />
                <button onClick={() => { setImage(""); if (fileInputRef.current) fileInputRef.current.value = "" }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-zinc-700 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                  <X size={14} className="text-white" />
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 border border-zinc-700 text-[11px] font-bold text-zinc-300 hover:border-emerald-500/50 transition-colors">
                  Replace
                </button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-16 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center gap-3 hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Upload size={20} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-300">Click to upload image</p>
                  <p className="text-[11px] text-zinc-600 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </button>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Title (optional)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image caption" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-zinc-400">Alt Text</label>
                <Info size={12} className="text-zinc-600" />
              </div>
              <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image for accessibility" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
            </div>

            {/* Alignment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Alignment</label>
              <div className="flex gap-2">
                {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([val, Icon]) => (
                  <button key={val} onClick={() => setAlignment(val)} className={`p-3 rounded-xl border transition-all ${alignment === val ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}>
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Rounded Corners */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Rounded corners</span>
              <Toggle value={rounded} onChange={setRounded} />
            </div>
          </div>

          {/* Link Option */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Add Link</h3>
              <Toggle value={addLink} onChange={setAddLink} />
            </div>
            {addLink && (
              <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
            )}
          </div>
        </div>
      )}
    </SettingsShell>
  )
}
