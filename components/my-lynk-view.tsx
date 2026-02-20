"use client"

import { useState } from "react"
import { Share2, ExternalLink, Smartphone, ChevronRight, Plus, Settings } from "lucide-react"
import { BlockItem, type Block } from "./block-item"
import { PhonePreview } from "./phone-preview"
import { AddBlockModal } from "./add-block-modal"
import { BlockSettingsView } from "./block-settings-view"
import type { AppearanceConfig } from "@/lib/appearance-types"

interface MyLynkViewProps {
  onShowPreview: () => void
  blocks: Block[]
  onAddBlock: (type: string) => void
  onToggleBlock: (id: number) => void
  onDeleteBlock: (id: number) => void
  onUpdateBlock?: (block: Block) => void
  appearance?: AppearanceConfig
  currency?: string
}

export function MyLynkView({ onShowPreview, blocks, onAddBlock, onToggleBlock, onDeleteBlock, onUpdateBlock, appearance, currency = "USD" }: MyLynkViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null)

  const editingBlock = editingBlockId !== null ? blocks.find((b) => b.id === editingBlockId) : null

  if (editingBlock) {
    return (
      <BlockSettingsView
        block={editingBlock}
        onClose={() => setEditingBlockId(null)}
        onUpdate={(updated) => {
          onUpdateBlock?.(updated)
          setEditingBlockId(null)
        }}
      />
    )
  }

  return (
    <>
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 grid grid-cols-1 xl:grid-cols-3 gap-10">
      <div className="xl:col-span-2 space-y-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3.5 flex items-center justify-between group">
              <div className="flex items-center gap-2 truncate">
                <span className="text-zinc-600 text-xs font-bold">{"My Lynkid:"}</span>
                <span className="text-emerald-400 font-black tracking-tight text-sm truncate">
                  {"https://lynk.id/affribute"}
                </span>
              </div>
              <ExternalLink size={16} className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 px-6 py-3 border border-emerald-500/50 text-emerald-500 rounded-2xl font-black text-xs uppercase transition-all hover:bg-emerald-500/10">
                <Share2 size={16} className="inline mr-1" /> Share
              </button>
              <button className="flex-1 px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                Customize URL
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onShowPreview}
          className="xl:hidden w-full flex items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Smartphone className="text-emerald-500" size={18} />
            </div>
            <span className="font-black text-sm uppercase">Open Page Preview</span>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-zinc-500 uppercase tracking-widest text-xs">Your Pages</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {"+ Page"}
              </button>
              <Settings size={18} className="text-zinc-500" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-emerald-500 text-black rounded-full text-xs font-black">Home</button>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-5 bg-emerald-500 text-black rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/10 hover:scale-[1.01] transition-all"
        >
          <Plus size={20} strokeWidth={4} />
          <span className="uppercase">Add new block</span>
        </button>

        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-black text-zinc-500 uppercase tracking-widest text-[10px]">Block List</h3>
          </div>
          {blocks.map((block) => (
            <BlockItem key={block.id} block={block} onToggle={onToggleBlock} onDelete={onDeleteBlock} onEdit={setEditingBlockId} />
          ))}
        </div>
      </div>
      <div className="hidden xl:flex flex-col items-center">
        <PhonePreview blocks={blocks} appearance={appearance} currency={currency} />
      </div>
    </div>

    {showAddModal && (
      <AddBlockModal
        onClose={() => setShowAddModal(false)}
        onSelect={(type) => onAddBlock(type)}
      />
    )}
    </>
  )
}
