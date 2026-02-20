"use client"

import { useState } from "react"
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, ChevronDown, Sparkles, Smile, Code2, Link2, Image as ImageLucide, Film } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

export function TextSettings({ block, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(block.title)
  const [content, setContent] = useState(block.content || "Start typing your text here...")
  const [headingType, setHeadingType] = useState(block.headingType || "Paragraph")

  return (
    <SettingsShell title="Edit Text" tabs={["Content"]} onClose={onClose} onSave={() => onUpdate({ ...block, title, content, headingType })}>
      {() => (
        <div className="max-w-xl space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Text Block</h3>

            {/* Heading Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Type</label>
              <div className="relative">
                <select value={headingType} onChange={(e) => setHeadingType(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium appearance-none focus:outline-none focus:border-emerald-500/50 transition-colors">
                  <option value="Heading 1">Heading 1</option>
                  <option value="Heading 2">Heading 2</option>
                  <option value="Heading 3">Heading 3</option>
                  <option value="Paragraph">Paragraph</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>

            {/* Rich Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400">Content</label>
              <div className="bg-black/60 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1 p-2 border-b border-zinc-800 flex-wrap">
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Sparkles size={14} /></button>
                  <div className="w-px h-5 bg-zinc-800" />
                  <button className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-500 text-xs font-medium flex items-center gap-1">16 <ChevronDown size={10} /></button>
                  <div className="w-px h-5 bg-zinc-800" />
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Bold size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Underline size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Italic size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Strikethrough size={14} /></button>
                  <div className="w-px h-5 bg-zinc-800" />
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><List size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><ListOrdered size={14} /></button>
                  <div className="w-px h-5 bg-zinc-800" />
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><AlignLeft size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><AlignCenter size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><AlignRight size={14} /></button>
                </div>
                <div className="flex items-center gap-1 p-2 border-b border-zinc-800">
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Link2 size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><ImageLucide size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Film size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Code2 size={14} /></button>
                  <button className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-500 text-xs font-medium flex items-center gap-1"><Smile size={14} /> Emoji</button>
                </div>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full bg-transparent px-4 py-3 text-sm text-zinc-300 resize-none focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </SettingsShell>
  )
}
