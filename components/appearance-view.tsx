"use client"

import {
  Share2,
  Settings,
  Upload,
  ImageIcon,
  User,
  Info,
  Check,
  Smile,
} from "lucide-react"
import { Toggle } from "@/components/settings-toggle"
import { PhonePreview } from "@/components/phone-preview"
import type { Block } from "@/components/block-item"
import type { AppearanceConfig } from "@/lib/appearance-types"
import { useRef } from "react"

const SOCIAL_LINKS = [
  "Telegram", "Website", "Email", "Discord", "Tiktok", "Instagram",
  "Youtube", "Twitch", "Linkedin", "X", "Facebook", "Behance",
  "Dribbble", "Whatsapp", "Spotify", "Threads",
]

const TEMPLATES: { name: string; bg: string; preset: Partial<AppearanceConfig> }[] = [
  { name: "I'm Feeling Lucky", bg: "bg-zinc-800", preset: { bgType: "flat", bgColor: "#18181b", textColor: "#f4f4f5", blockColor: "#10b981" } },
  { name: "Classic", bg: "bg-zinc-700", preset: { bgType: "flat", bgColor: "#27272a", textColor: "#f4f4f5", blockColor: "#a1a1aa" } },
  { name: "City Vibes", bg: "bg-gradient-to-b from-amber-800 to-zinc-900", preset: { bgType: "gradient-down", bgColor: "#92400e", textColor: "#fef3c7", blockColor: "#f59e0b" } },
  { name: "Splash Wave", bg: "bg-gradient-to-b from-rose-300 to-rose-100", preset: { bgType: "gradient-down", bgColor: "#fda4af", textColor: "#1c1917", blockColor: "#e11d48" } },
  { name: "Purple Doodle", bg: "bg-gradient-to-b from-purple-800 to-purple-600", preset: { bgType: "gradient-down", bgColor: "#6b21a8", textColor: "#f5f3ff", blockColor: "#a855f7" } },
  { name: "Orange Doodle", bg: "bg-gradient-to-b from-orange-600 to-yellow-500", preset: { bgType: "gradient-down", bgColor: "#ea580c", textColor: "#fffbeb", blockColor: "#f97316" } },
  { name: "Sunset Mountain", bg: "bg-gradient-to-b from-amber-700 to-amber-900", preset: { bgType: "gradient-down", bgColor: "#b45309", textColor: "#fef3c7", blockColor: "#d97706" } },
  { name: "Pink Sea", bg: "bg-gradient-to-b from-rose-200 to-zinc-300", preset: { bgType: "gradient-down", bgColor: "#fecdd3", textColor: "#1c1917", blockColor: "#f43f5e" } },
  { name: "Grinch", bg: "bg-gradient-to-b from-green-700 to-green-400", preset: { bgType: "gradient-down", bgColor: "#15803d", textColor: "#f0fdf4", blockColor: "#22c55e" } },
  { name: "Funky", bg: "bg-gradient-to-b from-violet-600 to-cyan-400", preset: { bgType: "gradient-up", bgColor: "#7c3aed", textColor: "#f5f3ff", blockColor: "#06b6d4" } },
  { name: "Tropics", bg: "bg-gradient-to-b from-yellow-300 via-pink-500 to-cyan-400", preset: { bgType: "gradient-down", bgColor: "#ec4899", textColor: "#ffffff", blockColor: "#fbbf24" } },
]

const FONTS = [
  { name: "Helvetica", style: "font-sans" },
  { name: "Lato", style: "font-sans" },
  { name: "Letter Gothic", style: "font-mono" },
  { name: "Raleway", style: "font-sans tracking-wider" },
  { name: "Montserrat", style: "font-sans font-bold" },
  { name: "Roboto", style: "font-sans" },
  { name: "Poppins", style: "font-sans font-medium" },
  { name: "Playfair", style: "font-serif italic" },
  { name: "Bodoni MT", style: "font-serif" },
  { name: "Script", style: "font-serif italic" },
  { name: "Handwritten", style: "font-serif italic" },
  { name: "Cursive", style: "font-serif italic" },
  { name: "Aesthetic", style: "font-serif" },
  { name: "Bull", style: "font-sans font-black uppercase" },
  { name: "Cavli", style: "font-serif italic" },
  { name: "Cartoon", style: "font-sans font-black uppercase tracking-widest" },
]

interface AppearanceViewProps {
  blocks: Block[]
  appearance: AppearanceConfig
  onChange: (update: Partial<AppearanceConfig>) => void
}

export function AppearanceView({ blocks, appearance, onChange }: AppearanceViewProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)

  const a = appearance

  const toggleSocial = (name: string) => {
    const next = a.activeSocials.includes(name)
      ? a.activeSocials.filter((s) => s !== name)
      : [...a.activeSocials, name]
    onChange({ activeSocials: next })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "bannerImage" | "profileImage") => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ [field]: url })
  }

  const applyTemplate = (template: typeof TEMPLATES[number]) => {
    onChange({
      selectedTemplate: template.name,
      ...template.preset,
      bgImage: null,
    })
  }

  return (
    <div className="flex gap-8">
      {/* Hidden file inputs */}
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "bannerImage")} />
      <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "profileImage")} />

      {/* Left Content */}
      <div className="flex-1 max-w-3xl space-y-8">
        {/* LynkID Bar */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500 font-medium">My Lynkid:</span>
            <span className="text-white font-bold">https://lynk.id/affribute</span>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/10 transition-colors">
              <Share2 size={14} /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl text-sm font-black hover:bg-emerald-400 transition-colors">
              <Settings size={14} /> Customize URL
            </button>
          </div>
        </div>

        {/* Page Style */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-8">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Page Style</h2>

          {/* Member Area Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-300">Enable Member Area Menu for Members</span>
              <Info size={14} className="text-zinc-600" />
            </div>
            <Toggle value={a.memberArea} onChange={(v) => onChange({ memberArea: v })} />
          </div>

          {/* Layout */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-zinc-300">Layout</span>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">PRO</span>
            </div>
            <p className="text-xs text-zinc-500 mb-5">This change will affect your product detail page as well</p>
            <div className="grid grid-cols-3 gap-4">
              {([
                { key: "classic" as const, label: "Classic" },
                { key: "modern" as const, label: "Modern (without bar)" },
                { key: "clean" as const, label: "Clean (no profile picture)" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ layout: opt.key })}
                  className={`rounded-2xl border-2 p-4 pt-6 flex flex-col items-center gap-3 transition-all ${
                    a.layout === opt.key
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  <div className="w-full aspect-[3/4] bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center gap-2 p-3">
                    {opt.key !== "clean" && (
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <User size={14} className="text-zinc-500" />
                      </div>
                    )}
                    {opt.key === "classic" && <div className="w-full h-6 bg-zinc-700 rounded" />}
                    <div className="w-full space-y-1.5">
                      <div className="h-2 bg-zinc-700 rounded w-full" />
                      <div className="h-2 bg-zinc-700 rounded w-3/4" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Banner & Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Banner</h3>
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="relative aspect-[16/9] bg-zinc-800/60 rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-2 hover:border-zinc-600 transition-colors cursor-pointer group overflow-hidden"
              >
                {a.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.bannerImage} className="absolute inset-0 w-full h-full object-cover" alt="banner" crossOrigin="anonymous" />
                ) : (
                  <>
                    <ImageIcon size={28} className="text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                    <span className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">Optimize banner size 1200 x 628 px</span>
                  </>
                )}
                <button className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors z-10">
                  <Upload size={16} className="text-black" />
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Profile Image</h3>
              <div className="flex flex-col items-center gap-4">
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
                >
                  {a.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.profileImage} className="w-full h-full object-cover" alt="profile" crossOrigin="anonymous" />
                  ) : (
                    <User size={40} className="text-emerald-500" />
                  )}
                </div>
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
                >
                  <Upload size={16} className="text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-3">About</h3>
            <div className="relative">
              <textarea
                value={a.about}
                onChange={(e) => onChange({ about: e.target.value })}
                placeholder="I'm a Content Creator"
                rows={4}
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-y"
              />
              <button className="absolute top-3 right-3 text-amber-400 hover:text-amber-300 transition-colors">
                <Smile size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Profile Effects */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Profile Effects</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">NEW</span>
            </div>
            <p className="text-sm text-zinc-500">Customize your profile picture shape, animated borders, and badge.</p>
          </div>

          {/* Profile Shape */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Shape</h3>
            <div className="flex gap-4">
              {([
                { key: "circle" as const, label: "Circle" },
                { key: "rounded-square" as const, label: "Rounded Square" },
                { key: "hexagon" as const, label: "Hexagon" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ profileShape: opt.key })}
                  className={`flex flex-col items-center gap-2.5 py-3 px-5 rounded-2xl border-2 transition-all ${
                    a.profileShape === opt.key
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-10 h-10 bg-zinc-700 flex items-center justify-center ${
                      opt.key === "circle" ? "rounded-full"
                        : opt.key === "rounded-square" ? "rounded-xl"
                        : "hexagon-clip"
                    }`}
                  >
                    <User size={16} className="text-zinc-400" />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Effect */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Border Effect</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                { key: "none" as const, label: "None" },
                { key: "solid" as const, label: "Solid" },
                { key: "gradient-spin" as const, label: "Gradient Spin" },
                { key: "glow-pulse" as const, label: "Glow Pulse" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ profileBorderEffect: opt.key })}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.profileBorderEffect === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Border Colors (only when not "none") */}
          {a.profileBorderEffect !== "none" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                    {a.profileBorderEffect === "solid" ? "Border Color" : "Color 1"}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                      <input type="color" value={a.profileBorderColor1} onChange={(e) => onChange({ profileBorderColor1: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full h-full" style={{ backgroundColor: a.profileBorderColor1 }} />
                    </label>
                    <input
                      type="text"
                      value={a.profileBorderColor1}
                      onChange={(e) => onChange({ profileBorderColor1: e.target.value })}
                      className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full"
                    />
                  </div>
                </div>
                {a.profileBorderEffect !== "solid" && (
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Color 2</label>
                    <div className="flex items-center gap-3">
                      <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                        <input type="color" value={a.profileBorderColor2} onChange={(e) => onChange({ profileBorderColor2: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full h-full" style={{ backgroundColor: a.profileBorderColor2 }} />
                      </label>
                      <input
                        type="text"
                        value={a.profileBorderColor2}
                        onChange={(e) => onChange({ profileBorderColor2: e.target.value })}
                        className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Border Width */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Border Width</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={a.profileBorderWidth}
                    onChange={(e) => onChange({ profileBorderWidth: Number(e.target.value) })}
                    className="flex-1 accent-emerald-500 h-1.5"
                  />
                  <span className="text-xs font-mono text-zinc-400 w-8 text-right">{a.profileBorderWidth}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Badge */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Badge</h3>
            <div className="flex gap-3">
              {([
                { key: "none" as const, label: "None", icon: null },
                { key: "verified" as const, label: "Verified", icon: "checkmark" },
                { key: "star" as const, label: "Star", icon: "star" },
                { key: "crown" as const, label: "Crown", icon: "crown" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ profileBadge: opt.key })}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                    a.profileBadge === opt.key
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-600"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {opt.key === "none" ? (
                      <span className="text-zinc-600 text-lg">-</span>
                    ) : opt.key === "verified" ? (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={a.profileBadge === opt.key ? a.profileBadgeColor : "#52525b"}>
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="0" />
                        <circle cx="12" cy="12" r="10" fill={a.profileBadge === opt.key ? a.profileBadgeColor : "#52525b"} />
                        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : opt.key === "star" ? (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={a.profileBadge === opt.key ? a.profileBadgeColor : "#52525b"}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={a.profileBadge === opt.key ? a.profileBadgeColor : "#52525b"}>
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 0l.858 4.573A1 1 0 006.843 21.5h10.314a1 1 0 00.985-.927L18.999 16H5z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{opt.label}</span>
                </button>
              ))}
            </div>
            {a.profileBadge !== "none" && (
              <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Badge Color</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                    <input type="color" value={a.profileBadgeColor} onChange={(e) => onChange({ profileBadgeColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full" style={{ backgroundColor: a.profileBadgeColor }} />
                  </label>
                  <input
                    type="text"
                    value={a.profileBadgeColor}
                    onChange={(e) => onChange({ profileBadgeColor: e.target.value })}
                    className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-40"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Header Style */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Header Style</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">NEW</span>
            </div>
            <p className="text-sm text-zinc-500">Style your display name and banner overlay.</p>
          </div>

          {/* Text Effect */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Display Name Effect</h3>
            <div className="grid grid-cols-5 gap-3">
              {([
                { key: "none" as const, label: "Plain" },
                { key: "gradient" as const, label: "Gradient" },
                { key: "outline" as const, label: "Outline" },
                { key: "glow" as const, label: "Glow" },
                { key: "shadow" as const, label: "Shadow" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ headerTextEffect: opt.key })}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.headerTextEffect === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient colors (only for gradient effect) */}
          {a.headerTextEffect === "gradient" && (
            <div className="flex gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Color 1</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                    <input type="color" value={a.headerGradientColor1} onChange={(e) => onChange({ headerGradientColor1: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full" style={{ backgroundColor: a.headerGradientColor1 }} />
                  </label>
                  <input type="text" value={a.headerGradientColor1} onChange={(e) => onChange({ headerGradientColor1: e.target.value })} className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Color 2</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                    <input type="color" value={a.headerGradientColor2} onChange={(e) => onChange({ headerGradientColor2: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full" style={{ backgroundColor: a.headerGradientColor2 }} />
                  </label>
                  <input type="text" value={a.headerGradientColor2} onChange={(e) => onChange({ headerGradientColor2: e.target.value })} className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Text Alignment */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Alignment</h3>
            <div className="flex gap-3">
              {([
                { key: "center" as const, label: "Center" },
                { key: "left" as const, label: "Left" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ headerAlignment: opt.key })}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.headerAlignment === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Banner Overlay */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Banner Overlay</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                { key: "none" as const, label: "None" },
                { key: "gradient-fade" as const, label: "Gradient" },
                { key: "darken" as const, label: "Darken" },
                { key: "blur" as const, label: "Blur" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ bannerOverlay: opt.key })}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.bannerOverlay === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Color */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-4">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Color</h2>
          <p className="text-xs text-zinc-500">Text color for your page content</p>
          <div className="flex items-center gap-3">
            <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
              <input
                type="color"
                value={a.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full h-full" style={{ backgroundColor: a.textColor }} />
            </label>
            <input
              type="text"
              value={a.textColor}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-40"
            />
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-5">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Social Links</h2>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((name) => (
              <button
                key={name}
                onClick={() => toggleSocial(name)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  a.activeSocials.includes(name)
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-5">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTemplate(t)}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  a.selectedTemplate === t.name
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className={`aspect-[3/5] ${t.bg} relative flex flex-col items-center justify-center p-3 gap-2`}>
                  <div className="w-6 h-6 rounded-full bg-black/20" />
                  <div className="w-full space-y-1.5">
                    <div className="h-2 bg-black/10 rounded w-full" />
                    <div className="h-2 bg-black/10 rounded w-3/4" />
                    <div className="h-2 bg-black/10 rounded w-full" />
                  </div>
                  {a.selectedTemplate === t.name && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-black" />
                    </div>
                  )}
                </div>
                <div className="bg-zinc-900 py-2 px-2">
                  <span className="text-[10px] font-bold text-zinc-400 block text-center">{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Appearance */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">Custom Appearance</h2>
            <p className="text-sm text-zinc-500">Completely customize your Lynk profile. Change your background with colours, gradients and images. Choose a button style, change the typeface and more.</p>
          </div>

          {/* Background */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Background</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {([
                { key: "flat" as const, label: "Flat Color" },
                { key: "gradient-up" as const, label: "Gradient Up" },
                { key: "gradient-down" as const, label: "Gradient Down" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ bgType: opt.key, bgImage: null, selectedTemplate: null })}
                  className={`rounded-2xl border-2 overflow-hidden transition-all ${
                    a.bgType === opt.key && !a.bgImage
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className="aspect-[3/4] w-full"
                    style={{
                      background:
                        opt.key === "flat"
                          ? a.bgColor
                          : opt.key === "gradient-up"
                          ? `linear-gradient(to top, ${a.bgColor}, ${a.bgColor}44)`
                          : `linear-gradient(to bottom, ${a.bgColor}, ${a.bgColor}44)`,
                    }}
                  />
                  <div className="bg-zinc-900 py-2 text-center">
                    <span className="text-[10px] font-bold text-zinc-400">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Upload Image */}
            <div className="mb-6">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    onChange({ bgImage: url, selectedTemplate: null })
                  }}
                />
                <div className={`aspect-[16/9] max-w-sm mx-auto border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500/40 transition-colors overflow-hidden ${a.bgImage ? "border-emerald-500/40 bg-transparent" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                  {a.bgImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.bgImage} className="w-full h-full object-cover" alt="bg" crossOrigin="anonymous" />
                  ) : (
                    <>
                      <ImageIcon size={28} className="text-emerald-500/50" />
                      <span className="text-sm font-bold text-emerald-500/70">Upload Image</span>
                    </>
                  )}
                </div>
              </label>
              <div className="flex items-center gap-2 mt-3 justify-center">
                <Info size={12} className="text-zinc-600" />
                <span className="text-xs text-zinc-600">Upload image</span>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Background Color</h3>
              <div className="flex items-center gap-3">
                <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                  <input
                    type="color"
                    value={a.bgColor}
                    onChange={(e) => onChange({ bgColor: e.target.value, selectedTemplate: null })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: a.bgColor }} />
                </label>
                <input
                  type="text"
                  value={a.bgColor}
                  onChange={(e) => onChange({ bgColor: e.target.value, selectedTemplate: null })}
                  className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Background Effects */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Background Effects</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">NEW</span>
            </div>
            <p className="text-sm text-zinc-500">Add animated effects and overlays to your background.</p>
          </div>

          {/* Effect Type */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Effect</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                { key: "none" as const, label: "None", desc: "No effect" },
                { key: "animated-gradient" as const, label: "Animated", desc: "Shifting gradient" },
                { key: "particles" as const, label: "Particles", desc: "Floating dots" },
                { key: "noise" as const, label: "Grain", desc: "Film grain" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ bgEffect: opt.key })}
                  className={`rounded-xl border-2 p-3 flex flex-col items-center gap-1.5 transition-all ${
                    a.bgEffect === opt.key
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-300">{opt.label}</span>
                  <span className="text-[8px] text-zinc-600">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Speed (only for animated-gradient) */}
          {a.bgEffect === "animated-gradient" && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Animation Speed</h3>
              <div className="flex gap-3">
                {([
                  { key: "slow" as const, label: "Slow" },
                  { key: "medium" as const, label: "Medium" },
                  { key: "fast" as const, label: "Fast" },
                ]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => onChange({ bgGradientSpeed: opt.key })}
                    className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      a.bgGradientSpeed === opt.key
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Overlay */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Overlay</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                { key: "none" as const, label: "None" },
                { key: "vignette" as const, label: "Vignette" },
                { key: "dark-fade" as const, label: "Dark Fade" },
                { key: "light-fade" as const, label: "Light Fade" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ bgOverlay: opt.key })}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.bgOverlay === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Fonts */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-5">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">Fonts</h2>
          <div className="grid grid-cols-4 gap-3">
            {FONTS.map((f) => (
              <button
                key={f.name}
                onClick={() => onChange({ selectedFont: f.name })}
                className={`flex flex-col items-center gap-2 py-5 px-2 rounded-2xl border-2 transition-all ${
                  a.selectedFont === f.name
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                <span className={`text-3xl text-zinc-300 ${f.style}`}>Aa</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{f.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CTA & Purchase Button Style */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">CTA & Purchase Button Style</h2>
              <Info size={14} className="text-zinc-600" />
            </div>
            <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">PRO</span>
          </div>
          <p className="text-sm text-zinc-500">
            {'This will apply to the "Compact Block Layout" and "Product Detail" buttons, allowing changes to all of your previous button styles.'}
          </p>

          {/* Button Style */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Button Style</h3>
            <div className="flex gap-4">
              <button
                onClick={() => onChange({ buttonStyle: "fill" })}
                className={`flex flex-col items-center gap-2 transition-all ${a.buttonStyle === "fill" ? "opacity-100" : "opacity-50 hover:opacity-70"}`}
              >
                <div className="px-8 py-3 rounded-xl text-sm font-bold transition-all" style={{ backgroundColor: a.blockColor, color: a.btnTextColor }}>
                  Call to Action
                </div>
                <span className="text-[10px] font-bold text-zinc-500">Fill Color</span>
              </button>
              <button
                onClick={() => onChange({ buttonStyle: "outline" })}
                className={`flex flex-col items-center gap-2 transition-all ${a.buttonStyle === "outline" ? "opacity-100" : "opacity-50 hover:opacity-70"}`}
              >
                <div className="px-8 py-3 rounded-xl text-sm font-bold border-2 transition-all" style={{ borderColor: a.blockColor, color: a.blockColor }}>
                  Call to Action
                </div>
                <span className="text-[10px] font-bold text-zinc-500">Outline Color</span>
              </button>
            </div>
          </div>

          {/* Button Shape */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Button Shape</h3>
            <div className="flex gap-4">
              {([
                { key: "square" as const, label: "Square", radius: "rounded-lg" },
                { key: "rounded" as const, label: "Rounded", radius: "rounded-xl" },
                { key: "pill" as const, label: "Pill", radius: "rounded-full" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ buttonShape: opt.key })}
                  className={`px-6 py-3 border-2 text-sm font-bold transition-all ${opt.radius} ${
                    a.buttonShape === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  Call to Action
                </button>
              ))}
            </div>
          </div>

          {/* Block Color / Text Color */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Block Color</h3>
              <div className="flex items-center gap-3">
                <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                  <input type="color" value={a.blockColor} onChange={(e) => onChange({ blockColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full h-full" style={{ backgroundColor: a.blockColor }} />
                </label>
                <input
                  type="text"
                  value={a.blockColor}
                  onChange={(e) => onChange({ blockColor: e.target.value })}
                  className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3">Text Color</h3>
              <div className="flex items-center gap-3">
                <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                  <input type="color" value={a.btnTextColor} onChange={(e) => onChange({ btnTextColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full h-full" style={{ backgroundColor: a.btnTextColor }} />
                </label>
                <input
                  type="text"
                  value={a.btnTextColor}
                  onChange={(e) => onChange({ btnTextColor: e.target.value })}
                  className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-full"
                />
              </div>
            </div>
          </div>

          {/* Apply Soft Shadow */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                a.softShadow
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-transparent border-zinc-600 hover:border-zinc-500"
              }`}
              onClick={() => onChange({ softShadow: !a.softShadow })}
            >
              {a.softShadow && <Check size={12} className="text-black" />}
            </div>
            <span className="text-sm font-bold text-zinc-300">Apply soft shadow</span>
          </label>
        </section>

        {/* Card Style */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Card Style</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">NEW</span>
            </div>
            <p className="text-sm text-zinc-500">Control how your block cards look -- style, corners, borders, shadows & transparency.</p>
          </div>

          {/* Card Style Picker */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Style</h3>
            <div className="grid grid-cols-4 gap-3">
              {([
                { key: "flat" as const, label: "Flat", desc: "Solid background" },
                { key: "glass" as const, label: "Glass", desc: "Frosted blur" },
                { key: "elevated" as const, label: "Elevated", desc: "Lifted shadow" },
                { key: "bordered" as const, label: "Bordered", desc: "Clean border" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ cardStyle: opt.key })}
                  className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                    a.cardStyle === opt.key
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  {/* Mini preview */}
                  <div
                    className="w-full aspect-[4/3] rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: opt.key === "flat" ? `${a.blockColor}18` : opt.key === "glass" ? `${a.blockColor}0c` : opt.key === "elevated" ? `${a.blockColor}12` : "transparent",
                      backdropFilter: opt.key === "glass" ? "blur(8px)" : "none",
                      border: opt.key === "bordered" ? `2px solid ${a.blockColor}40` : opt.key === "glass" ? `1px solid ${a.blockColor}20` : "none",
                      boxShadow: opt.key === "elevated" ? `0 8px 24px ${a.blockColor}15` : "none",
                    }}
                  >
                    <div className="space-y-1.5 w-3/4">
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: `${a.blockColor}40`, width: "70%" }} />
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: `${a.blockColor}25`, width: "100%" }} />
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: `${a.blockColor}25`, width: "50%" }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">{opt.label}</span>
                  <span className="text-[8px] text-zinc-600">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Corner Radius */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Corner Radius</h3>
            <div className="flex gap-3">
              {([
                { key: "none" as const, label: "Sharp", radius: "rounded-none" },
                { key: "sm" as const, label: "Small", radius: "rounded" },
                { key: "md" as const, label: "Medium", radius: "rounded-lg" },
                { key: "lg" as const, label: "Large", radius: "rounded-2xl" },
                { key: "full" as const, label: "Full", radius: "rounded-3xl" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ cardRadius: opt.key })}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 transition-all ${
                    a.cardRadius === opt.key ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 border-2 transition-all ${opt.radius} ${
                      a.cardRadius === opt.key ? "border-emerald-500 bg-emerald-500/15" : "border-zinc-600 bg-zinc-800/60"
                    }`}
                  />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Border */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-300">Card Border</h3>
              <Toggle value={a.cardBorderEnabled} onChange={(v) => onChange({ cardBorderEnabled: v })} />
            </div>
            {a.cardBorderEnabled && (
              <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex gap-6">
                  {/* Border Width */}
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Width</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={4}
                        value={a.cardBorderWidth}
                        onChange={(e) => onChange({ cardBorderWidth: Number(e.target.value) })}
                        className="flex-1 accent-emerald-500 h-1.5"
                      />
                      <span className="text-xs font-mono text-zinc-400 w-8 text-right">{a.cardBorderWidth}px</span>
                    </div>
                  </div>
                  {/* Border Opacity */}
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Opacity</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={5}
                        max={100}
                        value={a.cardBorderOpacity}
                        onChange={(e) => onChange({ cardBorderOpacity: Number(e.target.value) })}
                        className="flex-1 accent-emerald-500 h-1.5"
                      />
                      <span className="text-xs font-mono text-zinc-400 w-10 text-right">{a.cardBorderOpacity}%</span>
                    </div>
                  </div>
                </div>
                {/* Border Color */}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Border Color</label>
                  <div className="flex items-center gap-3">
                    <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                      <input type="color" value={a.cardBorderColor} onChange={(e) => onChange({ cardBorderColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full h-full" style={{ backgroundColor: a.cardBorderColor }} />
                    </label>
                    <input
                      type="text"
                      value={a.cardBorderColor}
                      onChange={(e) => onChange({ cardBorderColor: e.target.value })}
                      className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-40"
                    />
                    <button
                      onClick={() => onChange({ cardBorderColor: a.blockColor })}
                      className="px-3 py-2 rounded-lg border border-zinc-700 text-[10px] font-bold text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                    >
                      Match Block
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Shadow */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Shadow</h3>
            <div className="flex gap-3 mb-4">
              {([
                { key: "none" as const, label: "None" },
                { key: "subtle" as const, label: "Subtle" },
                { key: "medium" as const, label: "Medium" },
                { key: "bold" as const, label: "Bold" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => onChange({ cardShadow: opt.key })}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    a.cardShadow === opt.key
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {a.cardShadow !== "none" && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Shadow Color</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-10 h-10 rounded-xl border border-zinc-700 shrink-0 overflow-hidden cursor-pointer">
                    <input type="color" value={a.cardShadowColor} onChange={(e) => onChange({ cardShadowColor: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full" style={{ backgroundColor: a.cardShadowColor }} />
                  </label>
                  <input
                    type="text"
                    value={a.cardShadowColor}
                    onChange={(e) => onChange({ cardShadowColor: e.target.value })}
                    className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono focus:outline-none focus:border-emerald-500/50 w-40"
                  />
                  <button
                    onClick={() => onChange({ cardShadowColor: a.blockColor })}
                    className="px-3 py-2 rounded-lg border border-zinc-700 text-[10px] font-bold text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                  >
                    Match Block
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Opacity */}
          <div>
            <h3 className="text-sm font-bold text-zinc-300 mb-4">Card Opacity</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={100}
                value={a.cardOpacity}
                onChange={(e) => onChange({ cardOpacity: Number(e.target.value) })}
                className="flex-1 accent-emerald-500 h-1.5"
              />
              <span className="text-sm font-mono text-zinc-400 w-12 text-right">{a.cardOpacity}%</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">Lower values reveal more of the background through cards</p>
          </div>
        </section>

        {/* Block Hover Animations */}
        <section className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Block Hover Effect</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/25">NEW</span>
            </div>
            <p className="text-sm text-zinc-500">Choose what happens when visitors hover over your blocks.</p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {([
              { key: "none" as const, label: "None", desc: "Static" },
              { key: "lift" as const, label: "Lift", desc: "Floats up" },
              { key: "scale" as const, label: "Scale", desc: "Zooms in" },
              { key: "glow" as const, label: "Glow", desc: "Color glow" },
              { key: "tilt" as const, label: "Tilt", desc: "3D tilt" },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => onChange({ blockHover: opt.key })}
                className={`rounded-xl border-2 p-3 flex flex-col items-center gap-1.5 transition-all ${
                  a.blockHover === opt.key
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                <div
                  className={`w-10 h-6 rounded bg-zinc-700 transition-all ${
                    opt.key === "lift" ? "hover:-translate-y-0.5" : opt.key === "scale" ? "hover:scale-105" : ""
                  }`}
                />
                <span className="text-[10px] font-bold text-zinc-400">{opt.label}</span>
                <span className="text-[8px] text-zinc-600">{opt.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pb-8" />
      </div>

      {/* Right Side - Phone Preview */}
      <div className="hidden xl:flex flex-col items-center">
        <PhonePreview blocks={blocks} appearance={a} />
      </div>
    </div>
  )
}
