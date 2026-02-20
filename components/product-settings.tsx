"use client"

import { useState, useRef } from "react"
import {
  ImageIcon,
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  Link2,
  Image as ImageLucide,
  Film,
  Code2,
  Smile,
  Sparkles,
  ChevronDown,
  Info,
  Plus,
  LayoutGrid,
  LayoutList,
  Rows3,
  GalleryHorizontalEnd,
  X,
} from "lucide-react"
import type { Block } from "./block-item"
import { SettingsShell } from "./settings-shell"
import { Toggle } from "./settings-toggle"

interface ProductSettingsProps {
  block: Block
  onClose: () => void
  onUpdate: (block: Block) => void
}

type PlatformTab = "Upload" | "Dropbox" | "G-drive" | "Other"
type BlockLayout = "Default" | "Grid" | "Large Image" | "Compact"

export function ProductSettings({ block, onClose, onUpdate }: ProductSettingsProps) {
  const [title, setTitle] = useState(block.title)
  const [productImage, setProductImage] = useState(block.image || "")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [description, setDescription] = useState(
    block.description || "Learn to become a professional VFX artist and make your tiktok videos go viral!"
  )

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProductImage(url)
    }
  }
  const [platformTab, setPlatformTab] = useState<PlatformTab>("Other")
  const [platformUrl, setPlatformUrl] = useState("https://www.affribute.com/thank-you")
  const [price, setPrice] = useState("500000")
  const [comparePrice, setComparePrice] = useState("90000")
  const [currency, setCurrency] = useState("USD")
  const [purchaseButton, setPurchaseButton] = useState("Buy Now")
  const [addVideo, setAddVideo] = useState(false)
  const [payWhatYouWant, setPayWhatYouWant] = useState(false)
  const [itemQuantityUnlimited, setItemQuantityUnlimited] = useState(false)
  const [limitPerCheckout, setLimitPerCheckout] = useState(false)
  const [releaseTime, setReleaseTime] = useState(false)
  const [whatsappNotification, setWhatsappNotification] = useState(false)
  const [customMessage, setCustomMessage] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState<BlockLayout>("Large Image")
  const [nameRequired, setNameRequired] = useState(true)
  const [phoneRequired, setPhoneRequired] = useState(true)

  const layouts: { label: BlockLayout; icon: React.ReactNode }[] = [
    { label: "Default", icon: <LayoutList size={20} /> },
    { label: "Grid", icon: <LayoutGrid size={20} /> },
    { label: "Large Image", icon: <Rows3 size={20} /> },
    { label: "Compact", icon: <GalleryHorizontalEnd size={20} /> },
  ]

  return (
    <SettingsShell
      title="Edit Digital Product"
      onClose={onClose}
      onSave={() => onUpdate({ ...block, title, description, price, image: productImage || block.image })}
    >
      {(activeTab) =>
        activeTab === "Content" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Details */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Details</h3>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Image</label>
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                      {productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={productImage} alt="product" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={20} className="text-zinc-600" />
                        </div>
                      )}
                      {productImage && (
                        <button onClick={() => { setProductImage(""); if (imageInputRef.current) imageInputRef.current.value = "" }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <X size={8} className="text-white" />
                        </button>
                      )}
                    </div>
                    <button onClick={() => imageInputRef.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-1 hover:border-emerald-500/50 transition-colors">
                      <ImageLucide size={16} className="text-zinc-500" />
                      <span className="text-[8px] text-zinc-500 font-bold">{productImage ? "Replace" : "Add Image"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">Add video</span>
                    <Info size={12} className="text-zinc-600" />
                  </div>
                  <Toggle value={addVideo} onChange={setAddVideo} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Description</label>
                  <div className="bg-black/60 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-1 p-2 border-b border-zinc-800 flex-wrap">
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Sparkles size={14} /></button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-500 text-xs font-medium flex items-center gap-1">16 <ChevronDown size={10} /></button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Bold size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Underline size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Italic size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500 flex items-center gap-0.5">
                        <span className="text-sm font-bold text-emerald-400">A</span><ChevronDown size={10} />
                      </button>
                      <div className="w-px h-5 bg-zinc-800" />
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><List size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><ListOrdered size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><AlignLeft size={14} /></button>
                    </div>
                    <div className="flex items-center gap-1 p-2 border-b border-zinc-800">
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Link2 size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><ImageLucide size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Film size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Strikethrough size={14} /></button>
                      <button className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500"><Code2 size={14} /></button>
                      <button className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-500 text-xs font-medium flex items-center gap-1"><Smile size={14} /> Emoji</button>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-transparent px-4 py-3 text-sm text-zinc-300 resize-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-zinc-400">Platform</label>
                    <Info size={12} className="text-emerald-500" />
                  </div>
                  <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(["Upload", "Dropbox", "G-drive", "Other"] as PlatformTab[]).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setPlatformTab(tab)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            platformTab === tab ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {platformTab === "Other" && (
                      <input type="text" value={platformUrl} onChange={(e) => setPlatformUrl(e.target.value)} className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    )}
                    {platformTab === "Upload" && (
                      <label className="w-full py-8 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-colors cursor-pointer">
                        <input type="file" accept="*/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setPlatformUrl(e.target.files[0].name) }} />
                        <Upload size={20} className="text-zinc-500" />
                        <span className="text-xs text-zinc-500 font-bold">{platformUrl && platformTab === "Upload" ? platformUrl : "Click to upload file"}</span>
                      </label>
                    )}
                    {(platformTab === "Dropbox" || platformTab === "G-drive") && (
                      <input type="text" placeholder={`Paste ${platformTab} link here...`} className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Pricing</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Allow Customer to pay what they want</span>
                  <Toggle value={payWhatYouWant} onChange={setPayWhatYouWant} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400">Price</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400">Currency</label>
                    <div className="relative">
                      <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium appearance-none focus:outline-none focus:border-emerald-500/50 transition-colors">
                        <option value="USD">USD</option><option value="CAD">CAD</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <input type="text" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div><span className="text-xs font-bold text-zinc-400">Item Quantity</span><p className="text-[10px] text-zinc-600 font-bold mt-0.5">Unlimited</p></div>
                    <Toggle value={itemQuantityUnlimited} onChange={setItemQuantityUnlimited} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Limit qty per checkout</span>
                    <Toggle value={limitPerCheckout} onChange={setLimitPerCheckout} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Purchase Button</label>
                  <div className="relative">
                    <select value={purchaseButton} onChange={(e) => setPurchaseButton(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium appearance-none focus:outline-none focus:border-emerald-500/50 transition-colors">
                      <option value="Buy Now">Buy Now</option><option value="Get Now">Get Now</option><option value="Order Now">Order Now</option><option value="Grab Now">Grab Now</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Add On */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Add On</h3>
                  <Info size={12} className="text-zinc-600" />
                </div>
                <button className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:text-emerald-300 transition-colors">
                  <Plus size={14} /> Add New
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Review */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Review</h3>
                    <span className="text-xs text-zinc-500 font-bold">(0/10)</span>
                    <Info size={12} className="text-zinc-600" />
                    <Smile size={12} className="text-zinc-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:text-emerald-300 transition-colors"><Plus size={14} /> Add Review</button>
                    <ChevronDown size={14} className="text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Advance Options */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-wider">Advance Option</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-300">Release Time</span><Info size={12} className="text-zinc-600" /></div>
                  <div className="flex items-center justify-between"><span className="text-xs text-zinc-500">Set Release Time</span><Toggle value={releaseTime} onChange={setReleaseTime} /></div>
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-300">Fee Rp. 600/transaction</span><Info size={12} className="text-zinc-600" /></div>
                  <div className="flex items-center justify-between"><span className="text-xs text-zinc-500">Enable Whatsapp notification</span><Toggle value={whatsappNotification} onChange={setWhatsappNotification} /></div>
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-300">Custom Message</span><Info size={12} className="text-zinc-600" /></div>
                  <div className="flex items-center justify-between"><span className="text-xs text-zinc-500">Custom message on customer email</span><Toggle value={customMessage} onChange={setCustomMessage} /></div>
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="space-y-3">
                  <span className="text-xs font-bold text-zinc-300">Block Layout</span>
                  <div className="grid grid-cols-4 gap-2">
                    {layouts.map((layout) => (
                      <button key={layout.label} onClick={() => setSelectedLayout(layout.label)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedLayout === layout.label ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800 hover:border-zinc-700"}`}>
                        <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${selectedLayout === layout.label ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800/60 text-zinc-500"}`}>{layout.icon}</div>
                        <span className={`text-[9px] font-black uppercase tracking-wider ${selectedLayout === layout.label ? "text-emerald-400" : "text-zinc-500"}`}>{layout.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question for Customer */}
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Question for Customer</h3>
                  <p className="text-[11px] text-zinc-500 mt-1">Custom field for your customer to fill in during checkout</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Main Question</span>
                    <span className="text-xs font-bold text-zinc-400">Required</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">Name</span>
                    </label>
                    <Toggle value={nameRequired} onChange={setNameRequired} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">Phone</span>
                    </label>
                    <Toggle value={phoneRequired} onChange={setPhoneRequired} />
                  </div>
                  <p className="text-[10px] text-zinc-500">Required to activate <span className="text-emerald-400 font-bold">follow up text</span> feature</p>
                  <button className="w-full flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:text-emerald-300 transition-colors py-2">
                    <Plus size={14} /> Add Another Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-12 border border-zinc-800/50 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center">
              <Link2 size={28} className="text-zinc-500" />
            </div>
            <p className="text-zinc-500 text-sm font-bold">Integrations coming soon</p>
          </div>
        )
      }
    </SettingsShell>
  )
}
