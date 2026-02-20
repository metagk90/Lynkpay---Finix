"use client"

import { useState, useRef } from "react"
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, ChevronDown, Sparkles, Smile, Code2, Link2, Image as ImageLucide, Film, Upload, Info, ImageIcon, X } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function BlogSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [content, setContent] = useState(block.content || "")
  const [coverImage, setCoverImage] = useState(block.image || "")
  const [accessType, setAccessType] = useState<"free" | "paid" | "paywall">("free")
  const [price, setPrice] = useState(block.price || "0")
  const [currency, setCurrency] = useState("USD")
  const [enableComments, setEnableComments] = useState(true)
  const [showDate, setShowDate] = useState(true)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverImage(url)
    }
  }

  return (
    <SettingsShell title="Edit Blog" onClose={onClose} onSave={() => onUpdate({ ...block, title, content, image: coverImage || block.image, price: accessType !== "free" ? price : null, description: block.description })}>
      {(activeTab) =>
        activeTab === "Content" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Details */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Blog Post</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Cover Image</label>
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                  {coverImage ? (
                    <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverImage} alt="Cover" className="w-full max-h-48 object-cover" crossOrigin="anonymous" />
                      <button onClick={() => { setCoverImage(""); if (coverInputRef.current) coverInputRef.current.value = "" }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-zinc-700 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                        <X size={14} className="text-white" />
                      </button>
                      <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 border border-zinc-700 text-[11px] font-bold text-zinc-300 hover:border-emerald-500/50 transition-colors">
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => coverInputRef.current?.click()} className="w-full py-12 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-colors">
                      <Upload size={20} className="text-zinc-500" />
                      <span className="text-xs text-zinc-500 font-bold">Upload cover image</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Content</label>
                  <div className="bg-black/60 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-1 p-2 border-b border-zinc-800 flex-wrap">
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Sparkles size={14} /></button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Bold size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Italic size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Underline size={14} /></button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><List size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><ListOrdered size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><AlignLeft size={14} /></button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Link2 size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><ImageLucide size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500"><Code2 size={14} /></button>
                    </div>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Write your blog content..." className="w-full bg-transparent px-4 py-3 text-sm text-zinc-300 resize-none focus:outline-none placeholder:text-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Access */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Access</h3>
                <div className="flex flex-wrap gap-2">
                  {(["free", "paid", "paywall"] as const).map((a) => (
                    <button key={a} onClick={() => setAccessType(a)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${accessType === a ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>
                      {a === "paywall" ? "Paywall" : a === "paid" ? "Paid" : "Free"}
                    </button>
                  ))}
                </div>
                {accessType !== "free" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Price</label>
                      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Currency</label>
                      <div className="relative">
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium appearance-none focus:outline-none focus:border-emerald-500/50 transition-colors">
                          <option value="USD">USD</option><option value="CAD">CAD</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Options */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Options</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Enable comments</span>
                  <Toggle value={enableComments} onChange={setEnableComments} />
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Show published date</span>
                  <Toggle value={showDate} onChange={setShowDate} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-12 border border-zinc-800/50 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center"><Link2 size={28} className="text-zinc-500" /></div>
            <p className="text-zinc-500 text-sm font-bold">Integrations coming soon</p>
          </div>
        )
      }
    </SettingsShell>
  )
}
