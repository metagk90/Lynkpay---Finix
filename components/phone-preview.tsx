"use client"

import { useState } from "react"
import { X, Search, ShoppingCart, User, ArrowRight, ArrowLeft, CreditCard, Lock, Check, Loader2, AlertCircle } from "lucide-react"
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

function getSocialIcon(name: string) {
  const icons: Record<string, string> = {
    Instagram: "IG", Tiktok: "TT", Youtube: "YT", X: "X", Twitch: "TW",
    Linkedin: "LI", Facebook: "FB", Discord: "DC", Telegram: "TG",
    Website: "WB", Email: "EM", Behance: "BE", Dribbble: "DR",
    Whatsapp: "WA", Spotify: "SP", Threads: "TH",
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
            <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-10 px-4" style={bgStyle}>
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

              {/* Banner (if layout is classic and has banner) */}
              {a.layout === "classic" && a.bannerImage && (
                <div className="w-full aspect-[16/7] rounded-xl overflow-hidden mb-4 -mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.bannerImage} className="w-full h-full object-cover" alt="banner" crossOrigin="anonymous" />
                </div>
              )}

              {/* Profile section */}
              {a.layout !== "clean" && (
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="w-14 h-14 rounded-full border-2 p-0.5 mb-3 overflow-hidden"
                    style={{ borderColor: a.blockColor }}
                  >
                    {a.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.profileImage}
                        className="w-full h-full rounded-full object-cover"
                        alt="profile"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                        <User size={28} style={{ color: a.blockColor }} />
                      </div>
                    )}
                  </div>
                  <p className="font-black text-sm" style={{ color: a.textColor }}>
                    @affribute
                  </p>
                  {a.about && (
                    <p
                      className="text-[10px] mt-1.5 text-center px-6 leading-relaxed opacity-70"
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
              <div className="space-y-3 pb-10">
                {blocks
                  .filter((b) => b.active)
                  .map((block) => (
                    <div key={block.id} className="animate-in fade-in zoom-in duration-300">
                      {block.type === "Product" || block.type === "Digital Product" || block.type === "Physical Product" ? (
                        <div
                          className="overflow-hidden transition-shadow"
                          style={{
                            borderRadius: btnRadius,
                            backgroundColor: `${a.textColor === "#f4f4f5" || a.textColor === "#ffffff" ? "rgba(24,24,27,0.8)" : "rgba(255,255,255,0.9)"}`,
                            boxShadow: a.softShadow ? `0 4px 24px ${a.blockColor}15` : "none",
                          }}
                        >
                          <div className="aspect-[16/9] bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.image || "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400"}
                              className="w-full h-full object-cover opacity-80"
                              alt={block.title}
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-black text-[11px] mb-1 uppercase" style={{ color: a.textColor }}>
                              {block.title}
                            </p>
                            <span className="text-[10px] font-black" style={{ color: a.blockColor }}>
                              {"$"}
                              {block.price || "90,000"}
                            </span>
                            {/* CTA Buy Now Button */}
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
                      ) : (
                        <div
                          className="p-3 flex items-center justify-between transition-shadow"
                          style={{
                            borderRadius: btnRadius,
                            backgroundColor: a.buttonStyle === "fill" ? a.blockColor : "transparent",
                            color: a.buttonStyle === "fill" ? a.btnTextColor : a.blockColor,
                            border: a.buttonStyle === "outline" ? `2px solid ${a.blockColor}` : "none",
                            boxShadow: a.softShadow ? `0 4px 24px ${a.blockColor}15` : "none",
                          }}
                        >
                          <span className="text-xs font-black uppercase tracking-wide">{block.title}</span>
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
