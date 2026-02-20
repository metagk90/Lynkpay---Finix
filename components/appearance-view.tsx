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

        <div className="pb-8" />
      </div>

      {/* Right Side - Phone Preview */}
      <div className="hidden xl:flex flex-col items-center">
        <PhonePreview blocks={blocks} appearance={a} />
      </div>
    </div>
  )
}
