"use client"

import { useState } from "react"
import { X, Search, ShoppingCart, User, ArrowRight, ArrowLeft, CreditCard, Lock, Check, Loader2, AlertCircle, Play, ExternalLink, Heart, Calendar, BookOpen, GraduationCap, Clock, MapPin, Mail, Truck, Tag } from "lucide-react"
import type { Block } from "./block-item"
import type { AppearanceConfig } from "@/lib/appearance-types"
import { DEFAULT_APPEARANCE } from "@/lib/appearance-types"

interface PhonePreviewProps {
  isModal?: boolean
  onClose?: () => void
  blocks: Block[]
  appearance?: AppearanceConfig
  currency?: string
}

function getBackgroundStyle(a: AppearanceConfig): React.CSSProperties {
  if (a.bgImage) {
    return {
      backgroundImage: `url(${a.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }
  if (a.bgType === "gradient-up") {
    return { background: `linear-gradient(to top, ${a.bgColor}, ${a.bgColor}44)` }
  }
  if (a.bgType === "gradient-down") {
    return { background: `linear-gradient(to bottom, ${a.bgColor}, ${a.bgColor}44)` }
  }
  return { backgroundColor: a.bgColor }
}

function getButtonRadius(shape: AppearanceConfig["buttonShape"]) {
  if (shape === "square") return "6px"
  if (shape === "pill") return "9999px"
  return "12px"
  }

  function getCardRadius(radius: AppearanceConfig["cardRadius"]) {
    if (radius === "none") return "0px"
    if (radius === "sm") return "6px"
    if (radius === "md") return "12px"
    if (radius === "lg") return "20px"
    if (radius === "full") return "28px"
    return "12px"
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 }
  }

  function getCardShadow(level: AppearanceConfig["cardShadow"], color: string) {
    const { r, g, b } = hexToRgb(color)
    if (level === "subtle") return `0 2px 8px rgba(${r},${g},${b},0.08)`
    if (level === "medium") return `0 4px 20px rgba(${r},${g},${b},0.15)`
    if (level === "bold") return `0 8px 40px rgba(${r},${g},${b},0.25), 0 2px 8px rgba(${r},${g},${b},0.1)`
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

// ---------- Checkout Screen ----------
interface CheckoutScreenProps {
  block: Block
  appearance: AppearanceConfig
  onBack: () => void
  currency: string
  }
  
  function CheckoutScreen({ block, appearance: a, onBack, currency }: CheckoutScreenProps) {
  const [step, setStep] = useState<"info" | "payment" | "processing" | "success" | "error">("info")
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" })
  const [errorMsg, setErrorMsg] = useState("")
  const [txnId, setTxnId] = useState("")

  const btnRadius = getButtonRadius(a.buttonShape)
  const priceStr = block.price || "9.99"
  const priceNum = Math.round(parseFloat(priceStr.replace(/[^0-9.]/g, "")) * 100) || 999 // amount in cents

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
  currency: currency,
          productTitle: block.title,
          customer: {
            firstName: customer.firstName,
            lastName: customer.lastName || customer.firstName,
            email: customer.email,
            phone: customer.phone || undefined,
          },
          card: {
            number: card.number.replace(/\s/g, ""),
            expirationMonth,
            expirationYear,
            securityCode: card.cvc,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || "Payment failed")
      }
      setTxnId(data.transactionId)
      setStep("success")
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Payment failed. Please try again."
      // Strip internal API details from user-facing errors
      msg = msg.replace(/Finix API error:\s*/gi, "").replace(/\|\s*\{.*\}/s, "").trim()
      if (!msg || msg.length > 200) msg = "Payment could not be processed. Please try again."
      setErrorMsg(msg)
      setStep("error")
    }
  }

  const canProceedInfo = customer.firstName.trim() && customer.email.trim() && customer.email.includes("@")
  const canPay = card.number.replace(/\s/g, "").length >= 15 && card.expiry.replace(/\s/g, "").length >= 4 && card.cvc.length >= 3

  // Shared card styling
  const cardBg = a.textColor === "#f4f4f5" || a.textColor === "#ffffff" ? "rgba(24,24,27,0.9)" : "rgba(255,255,255,0.95)"
  const inputBg = a.textColor === "#f4f4f5" || a.textColor === "#ffffff" ? "rgba(39,39,42,0.8)" : "rgba(243,244,246,1)"
  const inputText = a.textColor
  const labelColor = `${a.textColor}88`

  return (
    <div className="flex flex-col h-full">
      {/* Checkout Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3" style={{ backgroundColor: `${a.bgColor}ee` }}>
        {step !== "success" && (
          <button
            onClick={step === "payment" ? () => setStep("info") : onBack}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${a.textColor}11` }}
          >
            <ArrowLeft size={14} style={{ color: a.textColor }} />
          </button>
        )}
        <span className="text-xs font-black uppercase tracking-wider" style={{ color: a.textColor }}>
          {step === "success" ? "Order Confirmed" : "Checkout"}
        </span>
        <div className="ml-auto">
          <Lock size={12} style={{ color: `${a.textColor}44` }} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6" style={getBackgroundStyle(a)}>

        {/* Order Summary */}
        {step !== "success" && (
          <div className="mt-4 mb-4 p-3 rounded-xl" style={{ backgroundColor: cardBg }}>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.image || "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=100"}
                  className="w-full h-full object-cover"
                  alt={block.title}
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                <p className="text-[9px] mt-0.5" style={{ color: labelColor }}>{block.type}</p>
              </div>
              <p className="text-[11px] font-black flex-shrink-0" style={{ color: a.blockColor }}>${priceStr}</p>
            </div>
          </div>
        )}

        {/* Step: Customer Info */}
        {step === "info" && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: labelColor }}>Customer Details</p>
            <div className="space-y-2">
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>First Name *</label>
                <input
                  type="text"
                  value={customer.firstName}
                  onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold outline-none border border-transparent focus:border-current transition-colors"
                  style={{ backgroundColor: inputBg, color: inputText, borderColor: "transparent" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Last Name</label>
                <input
                  type="text"
                  value={customer.lastName}
                  onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold outline-none border border-transparent focus:border-current transition-colors"
                  style={{ backgroundColor: inputBg, color: inputText }}
                  onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Email *</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold outline-none border border-transparent focus:border-current transition-colors"
                  style={{ backgroundColor: inputBg, color: inputText }}
                  onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Phone</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold outline-none border border-transparent focus:border-current transition-colors"
                  style={{ backgroundColor: inputBg, color: inputText }}
                  onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                  onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                  placeholder="+62 ..."
                />
              </div>
            </div>

            <button
              onClick={() => setStep("payment")}
              disabled={!canProceedInfo}
              className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider mt-4 transition-all disabled:opacity-40"
              style={{
                borderRadius: btnRadius,
                backgroundColor: a.blockColor,
                color: a.btnTextColor,
              }}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step: Card Payment */}
        {step === "payment" && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: labelColor }}>Payment Method</p>

            <div className="p-3 rounded-xl" style={{ backgroundColor: cardBg }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} style={{ color: a.blockColor }} />
                <span className="text-[10px] font-black uppercase" style={{ color: a.textColor }}>Credit / Debit Card</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Card Number</label>
                  <input
                    type="text"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg text-[11px] font-mono font-semibold outline-none border border-transparent focus:border-current transition-colors"
                    style={{ backgroundColor: inputBg, color: inputText }}
                    onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                    onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>Expiry</label>
                    <input
                      type="text"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg text-[11px] font-mono font-semibold outline-none border border-transparent focus:border-current transition-colors"
                      style={{ backgroundColor: inputBg, color: inputText }}
                      onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                      placeholder="MM / YY"
                      maxLength={7}
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>CVC</label>
                    <input
                      type="text"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className="w-full px-3 py-2 rounded-lg text-[11px] font-mono font-semibold outline-none border border-transparent focus:border-current transition-colors"
                      style={{ backgroundColor: inputBg, color: inputText }}
                      onFocus={(e) => e.currentTarget.style.borderColor = a.blockColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total */}
            <div className="p-3 rounded-xl" style={{ backgroundColor: cardBg }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px]" style={{ color: labelColor }}>Subtotal</span>
                <span className="text-[10px] font-bold" style={{ color: a.textColor }}>${priceStr}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px]" style={{ color: labelColor }}>Processing Fee</span>
                <span className="text-[10px] font-bold" style={{ color: a.textColor }}>$0.00</span>
              </div>
              <div className="border-t pt-2" style={{ borderColor: `${a.textColor}11` }}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase" style={{ color: a.textColor }}>Total</span>
                  <span className="text-[12px] font-black" style={{ color: a.blockColor }}>${priceStr}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!canPay}
              className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider mt-2 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                borderRadius: btnRadius,
                backgroundColor: a.blockColor,
                color: a.btnTextColor,
              }}
            >
              <Lock size={10} />
              Pay ${`$${priceStr}`}
            </button>

            <p className="text-[7px] text-center mt-1 flex items-center justify-center gap-1" style={{ color: `${a.textColor}44` }}>
              <Lock size={8} />
              Secured with 256-bit SSL encryption
            </p>
          </div>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-pulse"
              style={{ backgroundColor: `${a.blockColor}22` }}
            >
              <Loader2 size={24} className="animate-spin" style={{ color: a.blockColor }} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: a.textColor }}>Processing Payment</p>
            <p className="text-[9px] mt-1" style={{ color: labelColor }}>Please wait, do not close this window...</p>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${a.blockColor}22` }}
            >
              <Check size={28} strokeWidth={3} style={{ color: a.blockColor }} />
            </div>
            <p className="text-[12px] font-black uppercase tracking-wider mb-1" style={{ color: a.textColor }}>
              Payment Successful
            </p>
            <p className="text-[9px] text-center px-6 leading-relaxed" style={{ color: labelColor }}>
              Thank you for your purchase! Your order for <strong style={{ color: a.textColor }}>{block.title}</strong> has been confirmed.
            </p>

            {txnId && (
              <div className="mt-4 p-3 rounded-xl w-full" style={{ backgroundColor: cardBg }}>
                <p className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: labelColor }}>Transaction ID</p>
                <p className="text-[9px] font-mono break-all" style={{ color: a.textColor }}>{txnId}</p>
              </div>
            )}

            <div className="mt-4 p-3 rounded-xl w-full" style={{ backgroundColor: cardBg }}>
              <div className="flex justify-between mb-1">
                <span className="text-[9px]" style={{ color: labelColor }}>Product</span>
                <span className="text-[9px] font-bold" style={{ color: a.textColor }}>{block.title}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-[9px]" style={{ color: labelColor }}>Amount</span>
                <span className="text-[9px] font-black" style={{ color: a.blockColor }}>${priceStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px]" style={{ color: labelColor }}>Email</span>
                <span className="text-[9px] font-bold" style={{ color: a.textColor }}>{customer.email}</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider mt-6 transition-all"
              style={{
                borderRadius: btnRadius,
                backgroundColor: a.blockColor,
                color: a.btnTextColor,
              }}
            >
              Back to Store
            </button>
          </div>
        )}

        {/* Step: Error */}
        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: a.textColor }}>Payment Failed</p>
            <p className="text-[9px] text-center px-6 leading-relaxed text-red-400">{errorMsg}</p>

            <div className="flex gap-2 mt-6 w-full">
              <button
                onClick={() => setStep("payment")}
                className="flex-1 py-2 text-[9px] font-black uppercase tracking-wider border-2 transition-all"
                style={{
                  borderRadius: btnRadius,
                  borderColor: a.blockColor,
                  color: a.blockColor,
                  backgroundColor: "transparent",
                }}
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-2 text-[9px] font-black uppercase tracking-wider transition-all"
                style={{
                  borderRadius: btnRadius,
                  backgroundColor: `${a.textColor}11`,
                  color: a.textColor,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Main PhonePreview ----------
export function PhonePreview({ isModal = false, onClose, blocks, appearance, currency = "USD" }: PhonePreviewProps) {
  const a = appearance || DEFAULT_APPEARANCE
  const bgStyle = getBackgroundStyle(a)
  const btnRadius = getButtonRadius(a.buttonShape)
  const [checkoutBlock, setCheckoutBlock] = useState<Block | null>(null)

  return (
    <div
      className={`flex flex-col items-center ${
        isModal
          ? "fixed inset-0 z-[60] bg-black/95 p-4 backdrop-blur-2xl animate-in fade-in zoom-in duration-300"
          : "sticky top-8 w-full animate-in slide-in-from-right-8 duration-700"
      }`}
    >
      {isModal && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-4 bg-zinc-900 rounded-full text-white hover:bg-zinc-800 border border-zinc-700 shadow-2xl"
        >
          <X size={24} />
        </button>
      )}

      <div className={`w-full ${isModal ? "max-w-[340px] h-[85vh]" : "max-w-[300px]"} relative`}>
        <div className="text-center mb-6">
          <h3 className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase">Page Preview</h3>
        </div>

        <div className="relative mx-auto w-full h-full aspect-[9/18.5] rounded-[3.5rem] border-[10px] border-[#1a1a1a] shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1a] rounded-b-3xl z-20" />

          {/* Checkout Screen */}
          {checkoutBlock ? (
  <CheckoutScreen
  block={checkoutBlock}
  appearance={a}
  currency={currency}
              onBack={() => setCheckoutBlock(null)}
            />
          ) : (
            <div
              className={`relative flex flex-col h-full overflow-y-auto no-scrollbar pt-10 ${a.contentWidth === "narrow" ? "px-6" : a.contentWidth === "wide" ? "px-2" : "px-4"} ${
                a.bgEffect === "noise" ? "bg-noise" : ""
              } ${
                a.bgOverlay === "vignette" ? "bg-vignette" : a.bgOverlay === "dark-fade" ? "bg-dark-fade" : a.bgOverlay === "light-fade" ? "bg-light-fade" : ""
              }`}
              style={{
                ...bgStyle,
                ...(a.bgEffect === "animated-gradient" ? {
                  background: `linear-gradient(-45deg, ${a.bgColor}, ${a.bgColor}88, ${a.blockColor}44, ${a.bgColor})`,
                  backgroundSize: "400% 400%",
                  animation: `bg-gradient-shift ${a.bgGradientSpeed === "slow" ? "12s" : a.bgGradientSpeed === "fast" ? "4s" : "7s"} ease infinite`,
                } : {}),
              }}
            >
              {/* Floating particles */}
              {a.bgEffect === "particles" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + (i % 3) * 1.5}px`,
                        height: `${2 + (i % 3) * 1.5}px`,
                        backgroundColor: `${a.textColor}${20 + (i % 3) * 10}`,
                        left: `${8 + (i * 7.5) % 84}%`,
                        bottom: `${(i * 13) % 60}%`,
                        animation: `float-particle ${5 + (i % 4) * 2}s ease-in-out infinite`,
                        animationDelay: `${(i * 0.7)}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Top bar */}
              <div className="flex justify-between items-center mb-8 px-2">
                <span className="text-xs font-black italic" style={{ color: a.textColor }}>
                  Home
                </span>
                <div className="flex gap-4">
                  <Search size={16} style={{ color: `${a.textColor}66` }} />
                  <ShoppingCart size={16} style={{ color: `${a.textColor}66` }} />
                </div>
              </div>

              {/* Banner (if bannerImage exists - show for all layouts except clean) */}
              {a.bannerImage && a.layout !== "clean" && (
                <div className="w-full aspect-[16/7] rounded-xl overflow-hidden mb-4 -mt-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.bannerImage}
                    className={`w-full h-full object-cover ${a.bannerOverlay === "blur" ? "blur-[2px] scale-105" : ""}`}
                    alt="banner"
                    crossOrigin="anonymous"
                  />
                  {a.bannerOverlay === "gradient-fade" && (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${a.bgColor})` }} />
                  )}
                  {a.bannerOverlay === "darken" && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                </div>
              )}

              {/* Profile section */}
              {a.layout !== "clean" && (
                <div className={`flex flex-col ${a.headerAlignment === "left" ? "items-start pl-2" : "items-center"} mb-6`}>
                  {/* Profile image with effects */}
                  <div className="relative mb-3">
                    <div
                      className={`w-14 h-14 relative z-10 p-0.5 overflow-hidden ${
                        a.profileShape === "rounded-square" ? "rounded-xl"
                          : a.profileShape === "hexagon" ? "hexagon-clip"
                          : "rounded-full"
                      } ${
                        a.profileBorderEffect === "gradient-spin" ? "profile-gradient-spin"
                          : a.profileBorderEffect === "glow-pulse" ? "profile-glow-pulse"
                          : ""
                      }`}
                      style={{
                        border: a.profileBorderEffect === "solid" ? `${a.profileBorderWidth ?? 2}px solid ${a.profileBorderColor1}` : a.profileBorderEffect === "none" ? "none" : undefined,
                        "--profile-color1": a.profileBorderColor1 ?? a.blockColor,
                        "--profile-color2": a.profileBorderColor2 ?? "#06b6d4",
                      } as React.CSSProperties}
                    >
                      <div className={`w-full h-full overflow-hidden ${
                        a.profileShape === "rounded-square" ? "rounded-[10px]"
                          : a.profileShape === "hexagon" ? "hexagon-clip"
                          : "rounded-full"
                      }`}>
                        {a.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={a.profileImage}
                            className="w-full h-full object-cover"
                            alt="profile"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <User size={28} style={{ color: a.blockColor }} />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Badge */}
                    {a.profileBadge && a.profileBadge !== "none" && (
                      <div className="absolute -bottom-0.5 -right-0.5 z-20">
                        {a.profileBadge === "verified" ? (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md">
                            <circle cx="12" cy="12" r="10" fill={a.profileBadgeColor ?? "#3b82f6"} />
                            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : a.profileBadge === "star" ? (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md" fill={a.profileBadgeColor ?? "#3b82f6"}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : a.profileBadge === "crown" ? (
                          <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-md" fill={a.profileBadgeColor ?? "#3b82f6"}>
                            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 0l.858 4.573A1 1 0 006.843 21.5h10.314a1 1 0 00.985-.927L18.999 16H5z" />
                          </svg>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <p
                    className="font-black text-sm"
                    style={{
                      ...(a.headerTextEffect === "gradient" ? {
                        background: `linear-gradient(135deg, ${a.headerGradientColor1 ?? a.blockColor}, ${a.headerGradientColor2 ?? "#06b6d4"})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      } : a.headerTextEffect === "outline" ? {
                        color: "transparent",
                        WebkitTextStroke: `1px ${a.textColor}`,
                      } : a.headerTextEffect === "glow" ? {
                        color: a.textColor,
                        textShadow: `0 0 8px ${a.blockColor}80, 0 0 16px ${a.blockColor}40`,
                      } : a.headerTextEffect === "shadow" ? {
                        color: a.textColor,
                        textShadow: `2px 2px 4px rgba(0,0,0,0.5)`,
                      } : {
                        color: a.textColor,
                      }),
                    }}
                  >
                    @affribute
                  </p>
                  {a.about && (
                    <p
                      className={`text-[10px] mt-1.5 px-6 leading-relaxed opacity-70 ${a.headerAlignment === "left" ? "text-left px-0" : "text-center"}`}
                      style={{ color: a.textColor }}
                    >
                      {a.about}
                    </p>
                  )}
                </div>
              )}

              {/* Social links row */}
              {a.activeSocials.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6 px-2">
                  {a.activeSocials.map((s) => (
                    <div
                      key={s}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[7px] font-black"
                      style={{
                        backgroundColor: `${a.blockColor}22`,
                        color: a.blockColor,
                        border: `1px solid ${a.blockColor}44`,
                      }}
                    >
                      {getSocialIcon(s)}
                    </div>
                  ))}
                </div>
              )}

              {/* Blocks */}
              <div className="pb-10 flex flex-col" style={{ gap: a.blockGap === "tight" ? "6px" : a.blockGap === "relaxed" ? "16px" : a.blockGap === "loose" ? "24px" : "12px" }}>
                {blocks
                  .filter((b) => b.active)
                  .map((block) => {
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
                    const blockPad = a.blockPadding === "compact" ? "0px" : a.blockPadding === "spacious" ? "6px" : "0px"

                    return (
                    <div key={block.id} className={`animate-in fade-in zoom-in duration-300 ${hoverClass}`} style={{ "--block-glow-color": `${a.blockColor}40`, padding: blockPad } as React.CSSProperties}>

                      {/* ── Product / Digital Product / Physical Product ── */}
                      {(block.type === "Product" || block.type === "Digital Product") ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.image || "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400"}
                              className="w-full h-full object-cover"
                              alt={block.title}
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-black text-[11px] mb-0.5 uppercase" style={{ color: a.textColor }}>
                              {block.title}
                            </p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-1.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <span className="text-[10px] font-black" style={{ color: a.blockColor }}>
                              ${block.price || "0.00"}
                            </span>
                            <button
                              onClick={() => setCheckoutBlock(block)}
                              className="w-full mt-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none",
                              }}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>

                      /* ── Physical Product ── */
                      ) : block.type === "Physical" || block.type === "Physical Product" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"}
                              className="w-full h-full object-cover"
                              alt={block.title}
                              crossOrigin="anonymous"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}>
                              <Truck size={8} /> Ships
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-black text-[11px] mb-0.5 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-1.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <span className="text-[10px] font-black" style={{ color: a.blockColor }}>${block.price || "0.00"}</span>
                            <button
                              onClick={() => setCheckoutBlock(block)}
                              className="w-full mt-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none",
                              }}
                            >
                              Order Now
                            </button>
                          </div>
                        </div>

                      /* ── Image ── */
                      ) : block.type === "Image" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, boxShadow: shadow, border: bdr }}
                        >
                          <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden" style={{ borderRadius: cardR }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"}
                              className="w-full h-full object-cover"
                              alt={block.title}
                              crossOrigin="anonymous"
                            />
                          </div>
                          {block.title && block.title !== "Image Block" && (
                            <p className="text-[9px] text-center mt-1.5 font-bold" style={{ color: mutedText }}>{block.title}</p>
                          )}
                        </div>

                      /* ── Text ── */
                      ) : block.type === "Text" ? (
                        <div className="px-1 py-1">
                          {block.headingType === "Heading 1" ? (
                            <p className="font-black text-[15px] leading-tight" style={{ color: a.textColor }}>{block.content || block.title}</p>
                          ) : block.headingType === "Heading 2" ? (
                            <p className="font-black text-[13px] leading-snug" style={{ color: a.textColor }}>{block.content || block.title}</p>
                          ) : block.headingType === "Heading 3" ? (
                            <p className="font-bold text-[11px] uppercase tracking-wider" style={{ color: a.textColor }}>{block.content || block.title}</p>
                          ) : (
                            <p className="text-[10px] leading-relaxed" style={{ color: mutedText }}>{block.content || block.title}</p>
                          )}
                        </div>

                      /* ── Link ── */
                      ) : block.type === "Link" ? (
                        <div
                          className="p-3 flex items-center gap-3 transition-all"
                          style={{
                            borderRadius: cardR,
                            backgroundColor: a.buttonStyle === "fill" ? a.blockColor : cardBg,
                            color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                            border: a.cardBorderEnabled ? bdr : a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}22`,
                            boxShadow: shadow,
                            backdropFilter: cardBlur,
                          }}
                        >
                          {block.image && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.image} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wide block truncate">{block.title}</span>
                            {block.url && block.url !== "https://example.com" && (
                              <span className="text-[7px] opacity-60 block truncate">{block.url.replace(/https?:\/\//, "")}</span>
                            )}
                          </div>
                          <ExternalLink size={12} className="flex-shrink-0 opacity-60" />
                        </div>

                      /* ── Video ── */
                      ) : block.type === "Video" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="aspect-video relative overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${isDark ? "#18181b" : "#e4e4e7"}, ${isDark ? "#27272a" : "#d4d4d8"})` }}>
                            {/* Decorative lines */}
                            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${a.blockColor} 0, ${a.blockColor} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center z-10 shadow-lg"
                              style={{ backgroundColor: a.blockColor, boxShadow: `0 4px 20px ${a.blockColor}44` }}
                            >
                              <Play size={18} fill={a.btnTextColor} style={{ color: a.btnTextColor }} className="ml-0.5" />
                            </div>
                            {block.videoUrl && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[7px] font-black uppercase backdrop-blur-sm" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor, border: `1px solid ${a.blockColor}30` }}>
                                {block.videoUrl.includes("youtube") ? "YouTube" : block.videoUrl.includes("tiktok") ? "TikTok" : "Video"}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="font-black text-[10px] uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] mt-0.5 line-clamp-1" style={{ color: mutedText }}>{block.description}</p>
                            )}
                          </div>
                        </div>

                      /* ── Social ── */
                      ) : block.type === "Social" || block.type === "Social Connect" ? (
                        <div className="py-2">
                          {block.title && block.title !== "Follow Me" && (
                            <p className="text-[9px] font-bold text-center mb-2.5 uppercase tracking-wider" style={{ color: mutedText }}>{block.title}</p>
                          )}
                          <div className="flex flex-wrap justify-center gap-2.5">
                            {(block.socials || []).map((s, i) => (
                              <div
                                key={i}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[8px] font-black transition-transform hover:scale-110"
                                style={{
                                  backgroundColor: `${a.blockColor}18`,
                                  color: a.blockColor,
                                  border: `1.5px solid ${a.blockColor}40`,
                                }}
                              >
                                {getSocialIcon(s.platform)}
                              </div>
                            ))}
                          </div>
                        </div>

                      /* ── Blog ── */
                      ) : block.type === "Blog" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          {block.image && (
                            <div className="aspect-[2/1] bg-zinc-800 relative overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                              {block.price && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}>
                                  <Lock size={7} /> ${block.price}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <BookOpen size={10} style={{ color: a.blockColor }} />
                              <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: a.blockColor }}>Blog Post</span>
                            </div>
                            <p className="font-black text-[11px] mb-1" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed line-clamp-2 mb-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <button
                              className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider transition-all"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              Read Article
                            </button>
                          </div>
                        </div>

                      /* ── Appointment ── */
                      ) : block.type === "Appointment" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${a.blockColor}18` }}>
                                <Calendar size={14} style={{ color: a.blockColor }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[11px] uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="flex items-center gap-0.5 text-[8px] font-bold" style={{ color: mutedText }}>
                                    <Clock size={7} /> 30 min
                                  </span>
                                  {block.price && block.price !== "0.00" && (
                                    <span className="text-[8px] font-black" style={{ color: a.blockColor }}>${block.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <button
                              className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>

                      /* ── Course ── */
                      ) : block.type === "Course" || block.type === "Course Video" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          {block.image && (
                            <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}>
                                <GraduationCap size={8} /> Course
                              </div>
                            </div>
                          )}
                          <div className="p-3">
                            <p className="font-black text-[11px] mb-0.5 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-1.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            {block.price && block.price !== "0.00" && (
                              <span className="text-[10px] font-black" style={{ color: a.blockColor }}>${block.price}</span>
                            )}
                            <button
                              onClick={() => setCheckoutBlock(block)}
                              className="w-full mt-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none",
                              }}
                            >
                              Enroll Now
                            </button>
                          </div>
                        </div>

                      /* ── Event ── */
                      ) : block.type === "Event" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="p-3">
                            <div className="flex gap-3">
                              <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center rounded-xl py-2" style={{ backgroundColor: `${a.blockColor}15`, border: `1px solid ${a.blockColor}20` }}>
                                <Calendar size={14} style={{ color: a.blockColor }} />
                                <span className="text-[7px] font-black uppercase mt-1" style={{ color: a.blockColor }}>Event</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[11px] uppercase truncate" style={{ color: a.textColor }}>{block.title}</p>
                                {block.description && (
                                  <p className="text-[8px] leading-relaxed mt-0.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="flex items-center gap-0.5 text-[7px] font-bold" style={{ color: mutedText }}>
                                    <MapPin size={7} /> Online
                                  </span>
                                  {block.price && block.price !== "0.00" && (
                                    <span className="text-[8px] font-black" style={{ color: a.blockColor }}>${block.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              RSVP
                            </button>
                          </div>
                        </div>

                      /* ── Supports (Tip Jar) ── */
                      ) : block.type === "Supports" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="p-3 text-center">
                            <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${a.blockColor}15` }}>
                              <Heart size={18} style={{ color: a.blockColor }} />
                            </div>
                            <p className="font-black text-[11px] uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mt-1 px-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <div className="flex items-center justify-center gap-1.5 mt-3 mb-2.5">
                              {["3", "5", "10"].map((amt) => (
                                <div
                                  key={amt}
                                  className="px-3 py-1.5 rounded-full text-[9px] font-black transition-all cursor-pointer"
                                  style={{
                                    backgroundColor: amt === (block.price || "5") ? a.blockColor : `${a.blockColor}12`,
                                    color: amt === (block.price || "5") ? a.btnTextColor : a.blockColor,
                                    border: `1.5px solid ${amt === (block.price || "5") ? a.blockColor : `${a.blockColor}30`}`,
                                  }}
                                >
                                  ${amt}
                                </div>
                              ))}
                            </div>
                            <button
                              className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              Support
                            </button>
                          </div>
                        </div>

                      /* ── Contact Form ── */
                      ) : block.type === "Contact Form" || block.type === "Contact" || block.type === "Email & Phone Number" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2.5">
                              <Mail size={12} style={{ color: a.blockColor }} />
                              <p className="font-black text-[11px] uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            </div>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-2 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <div className="space-y-1.5 mb-2.5">
                              <div className="h-7 rounded-lg px-2.5 flex items-center" style={{ backgroundColor: subtleBg }}>
                                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Your name</span>
                              </div>
                              <div className="h-7 rounded-lg px-2.5 flex items-center" style={{ backgroundColor: subtleBg }}>
                                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Email address</span>
                              </div>
                              <div className="h-14 rounded-lg px-2.5 pt-2" style={{ backgroundColor: subtleBg }}>
                                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: `${a.textColor}33` }}>Your message</span>
                              </div>
                            </div>
                            <button
                              className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider transition-all"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              Send Message
                            </button>
                          </div>
                        </div>

                      /* ── Affiliate ── */
                      ) : block.type === "Affiliate" || block.type === "Affiliate Products" ? (
                        <div
                          className="overflow-hidden transition-all"
                          style={{ borderRadius: cardR, backgroundColor: cardBg, boxShadow: shadow, backdropFilter: cardBlur, border: bdr }}
                        >
                          {block.image && (
                            <div className="aspect-[16/9] bg-zinc-800 relative overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.image} className="w-full h-full object-cover" alt={block.title} crossOrigin="anonymous" />
                              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase" style={{ backgroundColor: `${a.blockColor}22`, color: a.blockColor }}>
                                <Tag size={8} /> Affiliate
                              </div>
                            </div>
                          )}
                          <div className="p-3">
                            <p className="font-black text-[11px] mb-0.5 uppercase" style={{ color: a.textColor }}>{block.title}</p>
                            {block.description && (
                              <p className="text-[8px] leading-relaxed mb-1.5 line-clamp-2" style={{ color: mutedText }}>{block.description}</p>
                            )}
                            <button
                              className="w-full mt-1 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1"
                              style={{
                                borderRadius: btnRadius,
                                backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                                color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                                border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}33`,
                              }}
                            >
                              Shop Now <ExternalLink size={9} />
                            </button>
                          </div>
                        </div>

                      /* ── Default / Fallback ── */
                      ) : (
                        <div
                          className="p-3 flex items-center justify-between transition-all"
                          style={{
                            borderRadius: cardR,
                            backgroundColor: a.buttonStyle === "fill" ? a.blockColor : cardBg,
                            color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                            border: a.cardBorderEnabled ? bdr : a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : a.buttonStyle === "fill" ? "none" : `1px solid ${a.blockColor}22`,
                            boxShadow: shadow,
                            backdropFilter: cardBlur,
                          }}
                        >
                          <span className="text-xs font-black uppercase tracking-wide">{block.title}</span>
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
