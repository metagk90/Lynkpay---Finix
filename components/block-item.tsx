"use client"

import { useState } from "react"
import { GripVertical, Package, Link as LinkIcon, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  onDuplicate?: (id: number) => void
  onMoveUp?: (id: number) => void
  onMoveDown?: (id: number) => void
  isFirst?: boolean
  isLast?: boolean
}

export function BlockItem({ block, onToggle, onDelete, onEdit, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast }: BlockItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? "relative" as const : undefined,
  }

  return (
    <>
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onEdit?.(block.id)}
      className={`bg-zinc-900/40 backdrop-blur-md border rounded-2xl p-4 flex items-center justify-between group hover:bg-zinc-800/40 transition-colors duration-300 cursor-pointer shadow-sm ${
        block.active ? "border-zinc-800/50" : "border-red-500/20 opacity-60"
      } ${isDragging ? "shadow-2xl shadow-emerald-500/10 border-emerald-500/30 bg-zinc-800/60" : ""}`}
      {...attributes}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-zinc-700 group-hover:text-zinc-500 cursor-grab active:cursor-grabbing transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
        {block.image ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700/50 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.image}
              alt={block.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
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
        )}
        <div className="min-w-0">
          <p className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">{block.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.1em] font-black">{block.type}</p>
            {block.price && (
              <>
                <span className="text-zinc-700 text-[10px]">{"/"}</span>
                <p className="text-[10px] text-emerald-500/70 font-bold">${block.price}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isFirst && onMoveUp && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveUp(block.id) }}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              aria-label="Move up"
            >
              <ChevronUp size={15} />
            </button>
          )}
          {!isLast && onMoveDown && (
            <button
              onClick={(e) => { e.stopPropagation(); onMoveDown(block.id) }}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              aria-label="Move down"
            >
              <ChevronDown size={15} />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(block.id) }}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
              aria-label="Duplicate block"
            >
              <Copy size={15} />
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteDialog(true)
          }}
          className="p-1.5 rounded-lg text-zinc-700 hover:text-red-500 hover:bg-zinc-800 transition-colors"
        >
          <Trash2 size={16} />
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Delete block</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete &ldquo;{block.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(block.id)}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
