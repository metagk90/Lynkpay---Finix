"use client"

import { GripVertical, Package, Link as LinkIcon, Trash2 } from "lucide-react"

export interface Block {
  id: number
  title: string
  type: string
  active: boolean
  price?: string | null
  image?: string | null
}

interface BlockItemProps {
  block: Block
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit?: (id: number) => void
}

export function BlockItem({ block, onToggle, onDelete, onEdit }: BlockItemProps) {
  return (
    <div
      onClick={() => onEdit?.(block.id)}
      className={`bg-zinc-900/40 backdrop-blur-md border rounded-2xl p-4 flex items-center justify-between group hover:bg-zinc-800/40 transition-all duration-300 cursor-pointer shadow-sm ${
        block.active ? "border-zinc-800/50" : "border-red-500/20 opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        <GripVertical size={18} className="text-zinc-700 group-hover:text-zinc-500 cursor-grab transition-colors" />
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            block.type === "Product"
              ? "bg-orange-500/10 border border-orange-500/20"
              : "bg-emerald-500/10 border border-emerald-500/20"
          }`}
        >
          {block.type === "Product" ? (
            <Package size={22} className="text-orange-500" />
          ) : (
            <LinkIcon size={22} className="text-emerald-500" />
          )}
        </div>
        <div>
          <p className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{block.title}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] font-black mt-0.5">{block.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(block.id)
          }}
          className="text-zinc-700 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
        <div
          onClick={(e) => {
            e.stopPropagation()
            onToggle(block.id)
          }}
          className={`w-10 h-5 rounded-full relative cursor-pointer border transition-colors ${
            block.active ? "bg-emerald-500/20 border-emerald-500/50" : "bg-zinc-800 border-zinc-700"
          }`}
        >
          <div
            className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${
              block.active ? "right-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "left-1 bg-zinc-600"
            }`}
          />
        </div>
      </div>
    </div>
  )
}
