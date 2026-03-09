"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, ShoppingCart, User, ArrowRight, ArrowLeft, CreditCard, Lock,
  Check, Loader2, AlertCircle, Play, ExternalLink, Heart, Calendar,
  BookOpen, GraduationCap, Clock, MapPin, Mail, Truck, Tag,
} from "lucide-react"
import type { AppearanceConfig } from "@/lib/appearance-types"

/* ── Block type ── */
interface Block {
  id: number
  title: string
  type: string
  active: boolean
  price?: string | null
  image?: string | null
  description?: string | null
  url?: string | null
  videoUrl?: string | null
  content?: string | null
  headingType?: string | null
  socials?: { platform: string; url: string }[] | null
  thumbnailStyle?: "square" | "circle" | "none" | null
  layout?: "standard" | "featured" | "compact" | null
}

/* ── Helpers (same as phone-preview) ── */
function getBackgroundStyle(a: AppearanceConfig): React.CSSProperties {
  if (a.bgImage) return { backgroundImage: `url(${a.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
  if (a.bgType === "gradient-up") return { background: `linear-gradient(to top, ${a.bgColor}, ${a.bgColor}44)` }
  if (a.bgType === "gradient-down") return { background: `linear-gradient(to bottom, ${a.bgColor}, ${a.bgColor}44)` }
  return { backgroundColor: a.bgColor }
}

function getButtonRadius(shape: AppearanceConfig["buttonShape"]) {
  if (shape === "square") return "8px"
  if (shape === "pill") return "9999px"
  return "14px"
}

function getCardRadius(radius: AppearanceConfig["cardRadius"]) {
  if (radius === "none") return "0px"
  if (radius === "sm") return "8px"
  if (radius === "md") return "14px"
  if (radius === "lg") return "22px"
  if (radius === "full") return "30px"
  return "14px"
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 }
}

function getCardShadow(level: AppearanceConfig["cardShadow"], color: string) {
  const { r, g, b } = hexToRgb(color)
  if (level === "subtle") return `0 2px 10px rgba(${r},${g},${b},0.08)`
  if (level === "medium") return `0 6px 24px rgba(${r},${g},${b},0.15)`
  if (level === "bold") return `0 10px 48px rgba(${r},${g},${b},0.25), 0 4px 12px rgba(${r},${g},${b},0.1)`
  return "none"
}

function getSocialIcon(name: string) {
  const icons: Record<string, string> = {
    Instagram: "IG", Tiktok: "TT", TikTok: "TT", Youtube: "YT", YouTube: "YT",
    X: "X", "Twitter / X": "X", Twitter: "X", Twitch: "TW",
    Linkedin: "LI", LinkedIn: "LI", Facebook: "FB", Discord: "DC", Telegram: "TG",
    Website: "WB", Email: "EM", Behance: "BE", Dribbble: "DR",
    Whatsapp: "WA", WhatsApp: "WA", Spotify: "SP", Threads: "TH", Pinterest: "PI",
  }
  return icons[name] || name.slice(0, 2).toUpperCase()
}

function formatCardNumber(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2)
  return digits
}

/* ── Checkout overlay ── */
function CheckoutOverlay({
  block,
  a,
  onBack,
}: {
  block: Block
  a: AppearanceConfig
  onBack: () => void
}) {
  const [step, setStep] = useState<"info" | "payment" | "processing" | "success" | "error">("info")
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" })
  const [errorMsg, setErrorMsg] = useState("")
  const [txnId, setTxnId] = useState("")

  const btnRadius = getButtonRadius(a.buttonShape)
  const priceStr = block.price || "9.99"
  const priceNum = Math.round(parseFloat(priceStr.replace(/[^0-9.]/g, "")) * 100) || 999

  const isDark = a.textColor === "#f4f4f5" || a.textColor === "#ffffff"
  const cardBg = isDark ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.97)"
  const inputBg = isDark ? "rgba(39,39,42,0.8)" : "rgba(243,244,246,1)"
  const labelColor = `${a.textColor}88`

  const handlePay = async () => {
    setStep("processing")
    setErrorMsg("")
    const expiryParts = card.expiry.replace(/\s/g, "").split("/")
    const expirationMonth = expiryParts[0] || "01"
    const expirationYear = expiryParts[1] ? (expiryParts[1].length === 2 ? `20${expiryParts[1]}` : expiryParts[1]) : "2027"
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: priceNum,
          currency: "USD",
          productTitle: block.title,
          customer: { firstName: customer.firstName, lastName: customer.lastName || customer.firstName, email: customer.email, phone: customer.phone || undefined },
          card: { number: card.number.replace(/\s/g, ""), expirationMonth, expirationYear, securityCode: card.cvc },
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Payment failed")
      setTxnId(data.transactionId)
      setStep("success")
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Payment failed. Please try again."
      msg = msg.replace(/Finix API error:\s*/gi, "").replace(/\|\s*\{.*\}/s, "").trim()
      if (!msg || msg.length > 200) msg = "Payment could not be processed. Please try again."
      setErrorMsg(msg)
      setStep("error")
    }
  }

  const canProceedInfo = customer.firstName.trim() && customer.email.trim() && customer.email.includes("@")
  const canPay = card.number.replace(/\s/g, "").length >= 15 && card.expiry.replace(/\s/g, "").length >= 4 && card.cvc.length >= 3

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: `${a.bgColor}ee` }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: cardBg }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: `${a.textColor}11` }}>
          {step !== "success" && (
            <button onClick={step === "payment" ? () => setStep("info") : onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${a.textColor}08` }}>
              <ArrowLeft size={16} style={{ color: a.textColor }} />
            </button>
          )}
          <span className="text-sm font-black uppercase tracking-wider" style={{ color: a.textColor }}>
            {step === "success" ? "Order Confirmed" : "Checkout"}
          </span>
          <div className="ml-auto"><Lock size={14} style={{ color: `${a.textColor}44` }} /></div>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* Order Summary */}
          {step !== "success" && (
            <div className="flex gap-3 mb-5 p-3 rounded-xl" style={{ backgroundColor: `${a.textColor}06` }}>
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.image || "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=100"} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: labelColor }}>{block.type}</p>
              </div>
              <p className="text-sm font-black flex-shrink-0" style={{ color: a.blockColor }}>${priceStr}</p>
            </div>
          )}

          {/* Info step */}
          {step === "info" && (
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: labelColor }}>Customer Details</p>
              {[
                { label: "First Name *", value: customer.firstName, key: "firstName" as const, placeholder: "John" },
                { label: "Last Name", value: customer.lastName, key: "lastName" as const, placeholder: "Doe" },
                { label: "Email *", value: customer.email, key: "email" as const, placeholder: "john@email.com", type: "email" },
                { label: "Phone", value: customer.phone, key: "phone" as const, placeholder: "+1 ..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>{f.label}</label>
                  <input
                    type={f.type || "text"}
                    value={f.value}
                    onChange={(e) => setCustomer({ ...customer, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold outline-none border border-transparent focus:border-current transition-colors"
                    style={{ backgroundColor: inputBg, color: a.textColor }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = a.blockColor)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <button onClick={() => setStep("payment")} disabled={!canProceedInfo} className="w-full py-3 text-xs font-black uppercase tracking-wider mt-4 transition-all disabled:opacity-40" style={{ borderRadius: btnRadius, backgroundColor: a.blockColor, color: a.btnTextColor }}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment step */}
          {step === "payment" && (
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: labelColor }}>Payment Method</p>
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${a.textColor}06` }}>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={16} style={{ color: a.blockColor }} />
                  <span className="text-xs font-black uppercase" style={{ color: a.textColor }}>Credit / Debit Card</span>
                </div>
                <div className="space-y-2">
                  <input type="text" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg text-sm font-mono font-semibold outline-none border border-transparent focus:border-current" style={{ backgroundColor: inputBg, color: a.textColor }} onFocus={(e) => (e.currentTarget.style.borderColor = a.blockColor)} onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")} placeholder="4111 1111 1111 1111" maxLength={19} />
                  <div className="flex gap-2">
                    <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-mono font-semibold outline-none border border-transparent focus:border-current" style={{ backgroundColor: inputBg, color: a.textColor }} onFocus={(e) => (e.currentTarget.style.borderColor = a.blockColor)} onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")} placeholder="MM / YY" maxLength={7} />
                    <input type="text" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} className="w-24 px-4 py-2.5 rounded-lg text-sm font-mono font-semibold outline-none border border-transparent focus:border-current" style={{ backgroundColor: inputBg, color: a.textColor }} onFocus={(e) => (e.currentTarget.style.borderColor = a.blockColor)} onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")} placeholder="CVC" maxLength={4} />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${a.textColor}06` }}>
                <div className="flex justify-between mb-1"><span className="text-xs" style={{ color: labelColor }}>Subtotal</span><span className="text-xs font-bold" style={{ color: a.textColor }}>${priceStr}</span></div>
                <div className="flex justify-between mb-2"><span className="text-xs" style={{ color: labelColor }}>Processing Fee</span><span className="text-xs font-bold" style={{ color: a.textColor }}>$0.00</span></div>
                <div className="border-t pt-2" style={{ borderColor: `${a.textColor}11` }}>
                  <div className="flex justify-between"><span className="text-sm font-black uppercase" style={{ color: a.textColor }}>Total</span><span className="text-base font-black" style={{ color: a.blockColor }}>${priceStr}</span></div>
                </div>
              </div>
              <button onClick={handlePay} disabled={!canPay} className="w-full py-3 text-xs font-black uppercase tracking-wider mt-2 transition-all disabled:opacity-40 flex items-center justify-center gap-2" style={{ borderRadius: btnRadius, backgroundColor: a.blockColor, color: a.btnTextColor }}>
                <Lock size={12} /> Pay ${priceStr}
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse" style={{ backgroundColor: `${a.blockColor}22` }}>
                <Loader2 size={28} className="animate-spin" style={{ color: a.blockColor }} />
              </div>
              <p className="text-sm font-black uppercase tracking-wider" style={{ color: a.textColor }}>Processing Payment</p>
              <p className="text-xs mt-1" style={{ color: labelColor }}>Please wait...</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${a.blockColor}22` }}>
                <Check size={36} strokeWidth={3} style={{ color: a.blockColor }} />
              </div>
              <p className="text-base font-black uppercase tracking-wider mb-1" style={{ color: a.textColor }}>Payment Successful</p>
              <p className="text-xs text-center px-6 leading-relaxed" style={{ color: labelColor }}>
                {"Thank you for your purchase! Your order for "}<strong style={{ color: a.textColor }}>{block.title}</strong>{" has been confirmed."}
              </p>
              {txnId && (
                <div className="mt-4 p-3 rounded-xl w-full" style={{ backgroundColor: `${a.textColor}06` }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: labelColor }}>Transaction ID</p>
                  <p className="text-xs font-mono break-all" style={{ color: a.textColor }}>{txnId}</p>
                </div>
              )}
              <button onClick={onBack} className="w-full py-3 text-xs font-black uppercase tracking-wider mt-6" style={{ borderRadius: btnRadius, backgroundColor: a.blockColor, color: a.btnTextColor }}>
                Back to Profile
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <p className="text-sm font-black uppercase tracking-wider mb-1" style={{ color: a.textColor }}>Payment Failed</p>
              <p className="text-xs text-center px-6 text-red-400">{errorMsg}</p>
              <div className="flex gap-2 mt-6 w-full">
                <button onClick={() => setStep("payment")} className="flex-1 py-2.5 text-xs font-black uppercase border-2" style={{ borderRadius: btnRadius, borderColor: a.blockColor, color: a.blockColor, backgroundColor: "transparent" }}>Try Again</button>
                <button onClick={onBack} className="flex-1 py-2.5 text-xs font-black uppercase" style={{ borderRadius: btnRadius, backgroundColor: `${a.textColor}11`, color: a.textColor }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main public profile renderer ── */
interface PublicProfileRendererProps {
  profile: { username: string; firstName: string; lastName: string }
  blocks: Block[]
  appearance: AppearanceConfig
}

export function PublicProfileRenderer({ profile, blocks, appearance: a }: PublicProfileRendererProps) {
  const [checkoutBlock, setCheckoutBlock] = useState<Block | null>(null)
  
  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username
  const bgStyle = getBackgroundStyle(a)
  const btnRadius = getButtonRadius(a.buttonShape)
  const activeBlocks = blocks.filter((b) => b.active)

  /* ── Analytics tracking ── */
  const trackEvent = useCallback((event: string, block?: Block) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: profile.username,
        event,
        blockId: block?.id ?? null,
        blockTitle: block?.title ?? null,
        blockType: block?.type ?? null,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      }),
    }).catch(() => {}) // fire-and-forget
  }, [profile.username])

  // Track page view on mount
  useEffect(() => {
    trackEvent("page_view")
  }, [trackEvent])

  const handleBlockClick = useCallback((block: Block) => {
    trackEvent("link_click", block)
  }, [trackEvent])

  return (
    <>
      {checkoutBlock && <CheckoutOverlay block={checkoutBlock} a={a} onBack={() => setCheckoutBlock(null)} />}

      <div
        className={`min-h-screen flex flex-col items-center ${
          a.bgEffect === "noise" ? "bg-noise" : ""
        } ${
          a.bgOverlay === "vignette" ? "bg-vignette" : a.bgOverlay === "dark-fade" ? "bg-dark-fade" : a.bgOverlay === "light-fade" ? "bg-light-fade" : ""
        }`}
        style={{
          ...bgStyle,
          fontFamily: a.selectedFont || "Helvetica, sans-serif",
          ...(a.bgEffect === "animated-gradient"
            ? {
                background: `linear-gradient(-45deg, ${a.bgColor}, ${a.bgColor}88, ${a.blockColor}44, ${a.bgColor})`,
                backgroundSize: "400% 400%",
                animation: `bg-gradient-shift ${a.bgGradientSpeed === "slow" ? "12s" : a.bgGradientSpeed === "fast" ? "4s" : "7s"} ease infinite`,
              }
            : {}),
        }}
      >
        {/* Floating particles */}
        {a.bgEffect === "particles" && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                  backgroundColor: `${a.textColor}${20 + (i % 3) * 10}`,
                  left: `${5 + (i * 5) % 90}%`,
                  bottom: `${(i * 11) % 70}%`,
                  animation: `float-particle ${5 + (i % 4) * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content container */}
        <div
          className={`w-full relative z-10 ${
            a.contentWidth === "narrow" ? "max-w-md" : a.contentWidth === "wide" ? "max-w-2xl" : "max-w-lg"
          } mx-auto px-4 sm:px-6 pt-8 pb-16`}
        >
          {/* Top bar */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-black italic" style={{ color: a.textColor }}>Home</span>
            <div className="flex gap-4">
              <Search size={18} style={{ color: `${a.textColor}66` }} />
              <ShoppingCart size={18} style={{ color: `${a.textColor}66` }} />
            </div>
          </div>

          {/* Banner */}
          {a.layout === "classic" && a.bannerImage && (
            <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.bannerImage} className={`w-full h-full object-cover ${a.bannerOverlay === "blur" ? "blur-[2px] scale-105" : ""}`} alt="banner" crossOrigin="anonymous" />
              {a.bannerOverlay === "gradient-fade" && <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${a.bgColor})` }} />}
              {a.bannerOverlay === "darken" && <div className="absolute inset-0 bg-black/40" />}
            </div>
          )}

          {/* Profile section */}
          {a.layout !== "clean" && (
            <div className={`flex flex-col ${a.headerAlignment === "left" ? "items-start" : "items-center"} mb-8`}>
              {/* Profile image */}
              <div className="relative mb-4">
                <div
                  className={`w-20 h-20 relative z-10 p-0.5 overflow-hidden ${
                    a.profileShape === "rounded-square" ? "rounded-xl" : a.profileShape === "hexagon" ? "hexagon-clip" : "rounded-full"
                  } ${
                    a.profileBorderEffect === "gradient-spin" ? "profile-gradient-spin" : a.profileBorderEffect === "glow-pulse" ? "profile-glow-pulse" : ""
                  }`}
                  style={{
                    border: a.profileBorderEffect === "solid" ? `${a.profileBorderWidth ?? 2}px solid ${a.profileBorderColor1}` : a.profileBorderEffect === "none" ? "none" : undefined,
                    "--profile-color1": a.profileBorderColor1 ?? a.blockColor,
                    "--profile-color2": a.profileBorderColor2 ?? "#06b6d4",
                  } as React.CSSProperties}
                >
                  <div className={`w-full h-full overflow-hidden ${a.profileShape === "rounded-square" ? "rounded-[14px]" : a.profileShape === "hexagon" ? "hexagon-clip" : "rounded-full"}`}>
                    {a.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.profileImage} className="w-full h-full object-cover" alt="profile" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <User size={36} style={{ color: a.blockColor }} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Badge */}
                {a.profileBadge && a.profileBadge !== "none" && (
                  <div className="absolute -bottom-1 -right-1 z-20">
                    {a.profileBadge === "verified" ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md"><circle cx="12" cy="12" r="10" fill={a.profileBadgeColor ?? "#3b82f6"} /><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : a.profileBadge === "star" ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md" fill={a.profileBadgeColor ?? "#3b82f6"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    ) : a.profileBadge === "crown" ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md" fill={a.profileBadgeColor ?? "#3b82f6"}><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 0l.858 4.573A1 1 0 006.843 21.5h10.314a1 1 0 00.985-.927L18.999 16H5z" /></svg>
                    ) : null}
                  </div>
                )}
              </div>
              <p
                className="font-black text-lg"
                style={{
                  ...(a.headerTextEffect === "gradient" ? { background: `linear-gradient(135deg, ${a.headerGradientColor1 ?? a.blockColor}, ${a.headerGradientColor2 ?? "#06b6d4"})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }
                    : a.headerTextEffect === "outline" ? { color: "transparent", WebkitTextStroke: `1px ${a.textColor}` }
                    : a.headerTextEffect === "glow" ? { color: a.textColor, textShadow: `0 0 8px ${a.blockColor}80, 0 0 16px ${a.blockColor}40` }
                    : a.headerTextEffect === "shadow" ? { color: a.textColor, textShadow: `2px 2px 4px rgba(0,0,0,0.5)` }
                    : { color: a.textColor }),
                }}
              >
                {displayName}
              </p>
              <p className="text-xs font-bold mt-0.5" style={{ color: `${a.textColor}66` }}>@{profile.username}</p>
              {a.about && (
                <p className={`text-sm mt-2 leading-relaxed opacity-70 max-w-sm ${a.headerAlignment === "left" ? "text-left" : "text-center"}`} style={{ color: a.textColor }}>
                  {a.about}
                </p>
              )}
            </div>
          )}

          {/* Social links */}
          {a.activeSocials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              {a.activeSocials.map((s) => (
                <div key={s} className="w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-black cursor-pointer transition-transform hover:scale-110" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor, border: `1px solid ${a.blockColor}44` }}>
                  {getSocialIcon(s)}
                </div>
              ))}
            </div>
          )}

          {/* Blocks */}
          <div className="flex flex-col" style={{ gap: a.blockGap === "tight" ? "8px" : a.blockGap === "relaxed" ? "20px" : a.blockGap === "loose" ? "28px" : "14px" }}>
            {activeBlocks.map((block) => {
              const isDark = a.textColor === "#f4f4f5" || a.textColor === "#ffffff"
              const opacity = (a.cardOpacity ?? 100) / 100
              const baseCardBg = isDark ? `rgba(24,24,27,${0.8 * opacity})` : `rgba(255,255,255,${0.9 * opacity})`
              const glassCardBg = isDark ? `rgba(24,24,27,${0.4 * opacity})` : `rgba(255,255,255,${0.4 * opacity})`
              const cardBg = a.cardStyle === "glass" ? glassCardBg : a.cardStyle === "bordered" ? "transparent" : baseCardBg
              const cardBlur = a.cardStyle === "glass" ? "blur(12px) saturate(1.4)" : "none"
              const subtleBg = isDark ? "rgba(39,39,42,0.6)" : "rgba(243,244,246,0.8)"
              const shadow = a.cardShadow !== "none" ? getCardShadow(a.cardShadow, a.cardShadowColor) : a.softShadow ? `0 4px 24px ${a.blockColor}15` : a.cardStyle === "elevated" ? `0 6px 24px rgba(0,0,0,0.15)` : "none"
              const mutedText = `${a.textColor}88`
              const cardR = getCardRadius(a.cardRadius ?? "md")
              const bdr = a.cardBorderEnabled ? `${a.cardBorderWidth ?? 1}px solid ${a.cardBorderColor}${Math.round((a.cardBorderOpacity ?? 20) * 2.55).toString(16).padStart(2, "0")}` : a.cardStyle === "bordered" ? `1.5px solid ${a.blockColor}30` : "none"
              const hoverClass = a.blockHover === "lift" ? "block-hover-lift" : a.blockHover === "scale" ? "block-hover-scale" : a.blockHover === "glow" ? "block-hover-glow" : a.blockHover === "tilt" ? "block-hover-tilt" : ""
              const blockPad = a.blockPadding === "compact" ? "0px" : a.blockPadding === "spacious" ? "8px" : "0px"

              return (
                <div key={block.id} className={`${hoverClass}`} style={{ "--block-glow-color": `${a.blockColor}40`, padding: blockPad } as React.CSSProperties}>

                  {/* Product / Digital Product */}
                  {(block.type === "Product" || block.type === "Digital Product") ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={block.image || "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400"} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                      </div>
                      <div className="p-4">
                        <p className="font-black text-sm mb-1 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <span className="text-sm font-black" style={{ color: a.blockColor }}>${block.price || "0.00"}</span>
                        <button onClick={() => { handleBlockClick(block); setCheckoutBlock(block) }} className="w-full mt-3 py-2.5 text-xs font-black uppercase tracking-wider transition-all active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none" }}>
                          Buy Now
                        </button>
                      </div>
                    </div>

                  ) : block.type === "Physical" || block.type === "Physical Product" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={block.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}><Truck size={10} /> Ships</div>
                      </div>
                      <div className="p-4">
                        <p className="font-black text-sm mb-1 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <span className="text-sm font-black" style={{ color: a.blockColor }}>${block.price || "0.00"}</span>
                        <button onClick={() => { handleBlockClick(block); setCheckoutBlock(block) }} className="w-full mt-3 py-2.5 text-xs font-black uppercase tracking-wider transition-all active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none" }}>
                          Order Now
                        </button>
                      </div>
                    </div>

                  ) : block.type === "Image" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, boxShadow: shadow, border: bdr }}>
                      <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden" style={{ borderRadius: cardR }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={block.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                      </div>
                      {block.title && block.title !== "Image Block" && <p className="text-xs text-center mt-2 font-bold" style={{ color: mutedText }}>{block.title}</p>}
                    </div>

                  ) : block.type === "Text" ? (
                    <div className="px-1 py-1">
                      {block.headingType === "Heading 1" ? <p className="font-black text-xl leading-tight" style={{ color: a.textColor }}>{block.content || block.title}</p>
                        : block.headingType === "Heading 2" ? <p className="font-black text-lg leading-snug" style={{ color: a.textColor }}>{block.content || block.title}</p>
                        : block.headingType === "Heading 3" ? <p className="font-bold text-sm uppercase tracking-wider" style={{ color: a.textColor }}>{block.content || block.title}</p>
                        : <p className="text-sm leading-relaxed" style={{ color: mutedText }}>{block.content || block.title}</p>}
                    </div>

                  ) : block.type === "Link" ? (
                    <a href={block.url || "#"} target="_blank" rel="noopener noreferrer" onClick={() => handleBlockClick(block)} className="p-4 flex items-center gap-3 transition-all cursor-pointer" style={{ borderRadius: cardR, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : cardBg, color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.cardBorderEnabled ? bdr : a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}22`, boxShadow: shadow, backdropFilter: cardBlur, display: "flex", textDecoration: "none" }}>
                      {block.image && <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={block.image} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" /></div>}
                      <div className="flex-1 min-w-0"><span className="text-xs font-black uppercase tracking-wide block truncate">{block.title}</span>{block.url && block.url !== "https://example.com" && <span className="text-[10px] opacity-60 block truncate">{block.url.replace(/https?:\/\//, "")}</span>}</div>
                      <ExternalLink size={14} className="flex-shrink-0 opacity-60" />
                    </a>

                  ) : block.type === "Video" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <a href={block.videoUrl || "#"} target="_blank" rel="noopener noreferrer" onClick={() => handleBlockClick(block)} className="aspect-video relative overflow-hidden flex items-center justify-center block" style={{ background: `linear-gradient(135deg, ${isDark ? "#18181b" : "#e4e4e7"}, ${isDark ? "#27272a" : "#d4d4d8"})` }}>
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${a.blockColor} 0, ${a.blockColor} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-lg" style={{ backgroundColor: a.blockColor, boxShadow: `0 4px 20px ${a.blockColor}44` }}>
                          <Play size={22} fill={a.btnTextColor} style={{ color: a.btnTextColor }} className="ml-0.5" />
                        </div>
                      </a>
                      <div className="p-4">
                        <p className="font-black text-sm uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs mt-1 line-clamp-1" style={{ color: mutedText }}>{block.description}</p>}
                      </div>
                    </div>

                  ) : block.type === "Social" || block.type === "Social Connect" ? (
                    <div className="py-2">
                      {block.title && block.title !== "Follow Me" && <p className="text-xs font-bold text-center mb-3 uppercase tracking-wider" style={{ color: mutedText }}>{block.title}</p>}
                      <div className="flex flex-wrap justify-center gap-3">
                        {(block.socials || []).map((s, i) => (
                          <a key={i} href={s.url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-transform hover:scale-110" style={{ backgroundColor: `${a.blockColor}18`, color: a.blockColor, border: `1.5px solid ${a.blockColor}40` }}>
                            {getSocialIcon(s.platform)}
                          </a>
                        ))}
                      </div>
                    </div>

                  ) : block.type === "Blog" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      {block.image && <div className="aspect-[2/1] bg-zinc-800 relative overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />{block.price && <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}><Lock size={9} /> ${block.price}</div>}</div>}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2"><BookOpen size={12} style={{ color: a.blockColor }} /><span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: a.blockColor }}>Blog Post</span></div>
                        <p className="font-black text-sm mb-1" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: mutedText }}>{block.description}</p>}
                        <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33` }}>Read Article</button>
                      </div>
                    </div>

                  ) : block.type === "Appointment" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.blockColor}18` }}><Calendar size={16} style={{ color: a.blockColor }} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                            <div className="flex items-center gap-2 mt-0.5"><span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: mutedText }}><Clock size={9} /> 30 min</span>{block.price && block.price !== "0.00" && <span className="text-[10px] font-black" style={{ color: a.blockColor }}>${block.price}</span>}</div>
                          </div>
                        </div>
                        {block.description && <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33` }}>Book Now</button>
                      </div>
                    </div>

                  ) : block.type === "Course" || block.type === "Course Video" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      {block.image && <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" /><div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}><GraduationCap size={10} /> Course</div></div>}
                      <div className="p-4">
                        <p className="font-black text-sm mb-1 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        {block.price && block.price !== "0.00" && <span className="text-sm font-black" style={{ color: a.blockColor }}>${block.price}</span>}
                        <button onClick={() => { handleBlockClick(block); setCheckoutBlock(block) }} className="w-full mt-3 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none" }}>Enroll Now</button>
                      </div>
                    </div>

                  ) : block.type === "Event" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="p-4">
                        <div className="flex gap-3">
                          <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center rounded-xl py-2" style={{ backgroundColor: `${a.blockColor}15`, border: `1px solid ${a.blockColor}20` }}><Calendar size={16} style={{ color: a.blockColor }} /><span className="text-[9px] font-black uppercase mt-1" style={{ color: a.blockColor }}>Event</span></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && <p className="text-xs leading-relaxed mt-0.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                            <div className="flex items-center gap-2 mt-1.5"><span className="flex items-center gap-0.5 text-[9px] font-bold" style={{ color: mutedText }}><MapPin size={9} /> Online</span>{block.price && block.price !== "0.00" && <span className="text-[10px] font-black" style={{ color: a.blockColor }}>${block.price}</span>}</div>
                          </div>
                        </div>
                        <button className="w-full mt-3 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33` }}>RSVP</button>
                      </div>
                    </div>

                  ) : block.type === "Supports" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="p-4 text-center">
                        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${a.blockColor}15` }}><Heart size={22} style={{ color: a.blockColor }} /></div>
                        <p className="font-black text-sm uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed mt-1 px-4 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <div className="flex items-center justify-center gap-2 mt-4 mb-3">
                          {["3", "5", "10"].map((amt) => (
                            <div key={amt} className="px-4 py-2 rounded-full text-xs font-black cursor-pointer transition-all" style={{ backgroundColor: amt === (block.price || "5") ? a.blockColor : `${a.blockColor}12`, color: amt === (block.price || "5") ? a.btnTextColor : a.blockColor, border: `1.5px solid ${amt === (block.price || "5") ? a.blockColor : `${a.blockColor}30`}` }}>${amt}</div>
                          ))}
                        </div>
                        <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider active:scale-95" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33` }}>Support</button>
                      </div>
                    </div>

                  ) : block.type === "Contact Form" || block.type === "Contact" || block.type === "Email & Phone Number" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3"><Mail size={14} style={{ color: a.blockColor }} /><p className="font-black text-sm uppercase" style={{ color: a.textColor }}>{block.title}</p></div>
                        {block.description && <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <div className="space-y-2 mb-3">
                          <div className="h-9 rounded-lg px-3 flex items-center" style={{ backgroundColor: subtleBg }}><span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Your name</span></div>
                          <div className="h-9 rounded-lg px-3 flex items-center" style={{ backgroundColor: subtleBg }}><span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Email address</span></div>
                          <div className="h-16 rounded-lg px-3 pt-2.5" style={{ backgroundColor: subtleBg }}><span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Your message</span></div>
                        </div>
                        <button className="w-full py-2.5 text-xs font-black uppercase tracking-wider" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33` }}>Send Message</button>
                      </div>
                    </div>

                  ) : block.type === "Affiliate" || block.type === "Affiliate Products" ? (
                    <div className="overflow-hidden transition-all" style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}>
                      {block.image && <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" /><div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}><Tag size={10} /> Affiliate</div></div>}
                      <div className="p-4">
                        <p className="font-black text-sm mb-1 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                        {block.description && <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>}
                        <a href={block.url || "#"} target="_blank" rel="noopener noreferrer" className="w-full mt-2 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95 flex items-center justify-center gap-1" style={{ borderRadius: btnRadius, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent", color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`, display: "flex", textDecoration: "none" }}>
                          Shop Now <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>

                  ) : (
                    <div className="p-4 flex items-center justify-between transition-all cursor-pointer" style={{ borderRadius: cardR, backgroundColor: a.buttonStyle === "fill" ? a.blockColor : cardBg, color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor, border: a.cardBorderEnabled ? bdr : a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}22`, boxShadow: shadow, backdropFilter: cardBlur }}>
                      <span className="text-sm font-black uppercase tracking-wide">{block.title}</span>
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <a href="/" className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: `${a.textColor}33` }}>
              Powered by LynkPay
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
