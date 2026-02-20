"use client"

import { useState } from "react"
import {
  X,
  ImageIcon,
  Type,
  Link as LinkIcon,
  PlayCircle,
  Share2,
  Package,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Star,
  Heart,
  Users,
  Mail,
  ShoppingBag,
} from "lucide-react"

type BlockCategory = "all" | "basic" | "monetization"

interface BlockOption {
  icon: React.ElementType
  label: string
  description: string
  type: string
  category: "basic" | "monetization"
  badge?: string
  iconBg: string
  iconColor: string
}

const blockOptions: BlockOption[] = [
  {
    icon: ImageIcon,
    label: "Image",
    description: "Add images",
    type: "Image",
    category: "basic",
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  {
    icon: Type,
    label: "Text",
    description: "Add headlines and descriptions",
    type: "Text",
    category: "basic",
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  {
    icon: LinkIcon,
    label: "Link",
    description: "Add a link shortcut",
    type: "Link",
    category: "basic",
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  {
    icon: PlayCircle,
    label: "Video",
    description: "Play video from other platform",
    type: "Video",
    category: "basic",
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  {
    icon: Share2,
    label: "Social Connect",
    description: "Display your social media exposure",
    type: "Social",
    category: "basic",
    badge: "NEW",
    iconBg: "bg-emerald-500/15 border-emerald-500/25",
    iconColor: "text-emerald-400",
  },
  {
    icon: Package,
    label: "Digital Product",
    description: "Sell digital products",
    type: "Product",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: BookOpen,
    label: "Blog",
    description: "Create paywall or free story contents",
    type: "Blog",
    category: "monetization",
    badge: "NEW",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: CalendarDays,
    label: "Appointment",
    description: "Create paid calendar booking",
    type: "Appointment",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: GraduationCap,
    label: "Course Video",
    description: "Share your skills and knowledge",
    type: "Course",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: Star,
    label: "Event",
    description: "Create events for your fans",
    type: "Event",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: Heart,
    label: "Supports",
    description: "Accept gift from your followers",
    type: "Supports",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: Users,
    label: "Affiliate Products",
    description: "Get commission from selling products",
    type: "Affiliate",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: Mail,
    label: "Email & Phone Number",
    description: "Collect followers contact",
    type: "Contact",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
  {
    icon: ShoppingBag,
    label: "Physical Product",
    description: "Sell physical products",
    type: "Physical",
    category: "monetization",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    iconColor: "text-amber-400",
  },
]

interface AddBlockModalProps {
  onClose: () => void
  onSelect: (type: string) => void
}

export function AddBlockModal({ onClose, onSelect }: AddBlockModalProps) {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>("all")

  const filteredBasic = blockOptions.filter((o) => o.category === "basic")
  const filteredMonetization = blockOptions.filter((o) => o.category === "monetization")

  const showBasic = activeCategory === "all" || activeCategory === "basic"
  const showMonetization = activeCategory === "all" || activeCategory === "monetization"

  const tabs: { label: string; value: BlockCategory }[] = [
    { label: "All Blocks", value: "all" },
    { label: "Basic", value: "basic" },
    { label: "Monetization", value: "monetization" },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950 border border-zinc-800/60 rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-black text-white tracking-tight">Add new block</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeCategory === tab.value
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-6 no-scrollbar flex-1">
          {/* Basic Section */}
          {showBasic && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Basic</h3>
                <div className="flex-1 h-px bg-zinc-800/60" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredBasic.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      onSelect(option.type)
                      onClose()
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all duration-200 text-left group"
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${option.iconBg}`}>
                      <option.icon size={20} className={option.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                          {option.label}
                        </p>
                        {option.badge && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-black border border-emerald-500/30 uppercase">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monetization Section */}
          {showMonetization && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Monetization</h3>
                <div className="flex-1 h-px bg-zinc-800/60" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMonetization.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      onSelect(option.type)
                      onClose()
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700/60 transition-all duration-200 text-left group"
                  >
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${option.iconBg}`}>
                      <option.icon size={20} className={option.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                          {option.label}
                        </p>
                        {option.badge && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-black border border-emerald-500/30 uppercase">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
