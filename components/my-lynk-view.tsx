"use client"

import { useState, useMemo, useCallback } from "react"
import { Share2, ExternalLink, Smartphone, ChevronRight, Plus, Settings, Layers, Search, Check, Copy } from "lucide-react"
import { BlockItem, type Block } from "./block-item"
import { PhonePreview } from "./phone-preview"
import { AddBlockModal } from "./add-block-modal"
import { BlockSettingsView } from "./block-settings-view"
import type { AppearanceConfig } from "@/lib/appearance-types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

interface MyLynkViewProps {
  onShowPreview: () => void
  blocks: Block[]
  onAddBlock: (type: string) => void
  onToggleBlock: (id: number) => void
  onDeleteBlock: (id: number) => void
  onUpdateBlock?: (block: Block) => void
  onReorderBlocks?: (blocks: Block[]) => void
  onDuplicateBlock?: (id: number) => void
  appearance?: AppearanceConfig
  currency?: string
  userName?: string
}

export function MyLynkView({ onShowPreview, blocks, onAddBlock, onToggleBlock, onDeleteBlock, onUpdateBlock, onReorderBlocks, onDuplicateBlock, appearance, currency = "USD", userName = "" }: MyLynkViewProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("All")
  const [copied, setCopied] = useState(false)

  const profileUrl = userName ? `${typeof window !== "undefined" ? window.location.origin : ""}/${userName}` : ""

  const handleShare = useCallback(async () => {
    if (!profileUrl) return
    if (navigator.share) {
      try {
        await navigator.share({ title: `${userName}'s LynkPay`, url: profileUrl })
        return
      } catch {
        /* user cancelled or not supported */
      }
    }
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [profileUrl, userName])

  const handleCopyUrl = useCallback(async () => {
    if (!profileUrl) return
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [profileUrl])

  const blockTypes = useMemo(() => {
    const types = new Set(blocks.map((b) => b.type))
    return ["All", ...Array.from(types)]
  }, [blocks])

  const filteredBlocks = useMemo(() => {
    return blocks.filter((block) => {
      const matchesSearch = searchQuery === "" || block.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "All" || block.type === filterType
      return matchesSearch && matchesType
    })
  }, [blocks, searchQuery, filterType])

  const isFiltering = searchQuery !== "" || filterType !== "All"

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      const reordered = [...blocks]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)
      onReorderBlocks?.(reordered)
    }
  }

  function handleMoveUp(id: number) {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx <= 0) return
    const reordered = [...blocks]
    const [moved] = reordered.splice(idx, 1)
    reordered.splice(idx - 1, 0, moved)
    onReorderBlocks?.(reordered)
  }

  function handleMoveDown(id: number) {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx < 0 || idx >= blocks.length - 1) return
    const reordered = [...blocks]
    const [moved] = reordered.splice(idx, 1)
    reordered.splice(idx + 1, 0, moved)
    onReorderBlocks?.(reordered)
  }

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
      <div className="xl:col-span-2 space-y-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <a
              href={profileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 w-full bg-black/60 border border-zinc-800 rounded-2xl px-5 py-3.5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-zinc-600 text-xs font-bold">{"My Lynk:"}</span>
                <span className="text-emerald-400 font-black tracking-tight text-sm truncate">
                  {userName ? `lynkpay.co/${userName}` : "Set up your username"}
                </span>
              </div>
              <ExternalLink size={16} className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </a>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleShare}
                disabled={!userName}
                className="flex-1 px-6 py-3 border border-emerald-500/50 text-emerald-500 rounded-2xl font-black text-xs uppercase transition-all hover:bg-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Share2 size={16} className="inline mr-1" /> Share
              </button>
              <button
                onClick={handleCopyUrl}
                disabled={!userName}
                className="flex-1 px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {copied ? (
                  <><Check size={16} strokeWidth={3} /> Copied!</>
                ) : (
                  <><Copy size={16} strokeWidth={3} /> Copy URL</>
                )}
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
            <div className="flex items-center gap-3">
              <h3 className="font-black text-zinc-500 uppercase tracking-widest text-[10px]">Block List</h3>
              {blocks.length > 0 && (
                <span className="text-[10px] text-zinc-600 font-medium">
                  {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
                  <span className="text-zinc-700 mx-1">/</span>
                  <span className="text-emerald-500/60">{blocks.filter((b) => b.active).length} active</span>
                  {blocks.some((b) => !b.active) && (
                    <>
                      <span className="text-zinc-700 mx-1">/</span>
                      <span className="text-red-500/50">{blocks.filter((b) => !b.active).length} hidden</span>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          {blocks.length > 0 && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              {blockTypes.length > 2 && (
                <div className="flex gap-2 flex-wrap">
                  {blockTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all ${
                        filterType === type
                          ? "bg-emerald-500 text-black border-emerald-500"
                          : "bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 rounded-3xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mb-6">
                <Layers size={36} className="text-zinc-600" />
              </div>
              <h4 className="text-zinc-300 font-bold text-lg mb-2">No blocks yet</h4>
              <p className="text-zinc-600 text-sm text-center max-w-xs mb-6 leading-relaxed">
                Add your first block to start building your page. Products, links, blogs and more.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={3} />
                Add your first block
              </button>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Search size={32} className="text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-sm font-medium">No blocks match your search</p>
              <button
                onClick={() => { setSearchQuery(""); setFilterType("All") }}
                className="mt-3 text-emerald-500 text-xs font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : isFiltering ? (
            <div className="space-y-3">
              {filteredBlocks.map((block, index) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  onToggle={onToggleBlock}
                  onDelete={onDeleteBlock}
                  onEdit={setEditingBlockId}
                  onDuplicate={onDuplicateBlock}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  isFirst={index === 0}
                  isLast={index === filteredBlocks.length - 1}
                />
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      onToggle={onToggleBlock}
                      onDelete={onDeleteBlock}
                      onEdit={setEditingBlockId}
                      onDuplicate={onDuplicateBlock}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      isFirst={index === 0}
                      isLast={index === blocks.length - 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
      <div className="hidden xl:flex flex-col items-center sticky top-6 self-start">
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
