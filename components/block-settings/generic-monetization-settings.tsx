"use client"

import { useState } from "react"
import { Upload, ChevronDown, Info, Plus, ImageIcon } from "lucide-react"
import type { Block } from "../block-item"
import { SettingsShell } from "../settings-shell"
import { Toggle } from "../settings-toggle"

interface Props { block: Block; onClose: () => void; onUpdate: (b: Block) => void }

const typeConfig: Record<string, { title: string; fields: string[]; hasPrice?: boolean; hasDuration?: boolean; hasCapacity?: boolean }> = {
  Appointment: { title: "Edit Appointment", fields: ["duration", "location", "calendar"], hasPrice: true, hasDuration: true },
  Course: { title: "Edit Course Video", fields: ["modules", "preview"], hasPrice: true },
  Event: { title: "Edit Event", fields: ["date", "location", "capacity"], hasPrice: true, hasCapacity: true },
  Supports: { title: "Edit Supports", fields: ["goal", "message"], hasPrice: false },
  Affiliate: { title: "Edit Affiliate Products", fields: ["commission", "link"], hasPrice: true },
  Contact: { title: "Edit Email & Phone Number", fields: ["fields", "redirect"] },
  Physical: { title: "Edit Physical Product", fields: ["shipping", "weight", "variants"], hasPrice: true },
}

export function GenericMonetizationSettings({ block, onClose, onUpdate }: Props) {
  const config = typeConfig[block.type] || { title: `Edit ${block.type}`, fields: [], hasPrice: true }

  const [title, setTitle] = useState(block.title)
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("0")
  const [currency, setCurrency] = useState("USD")
  const [enableNotification, setEnableNotification] = useState(false)
  const [isActive, setIsActive] = useState(true)

  // Type-specific states
  const [duration, setDuration] = useState("60")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [supportMessage, setSupportMessage] = useState("Thank you for your support!")
  const [commissionRate, setCommissionRate] = useState("10")
  const [affiliateUrl, setAffiliateUrl] = useState("")
  const [weight, setWeight] = useState("")
  const [shippingNote, setShippingNote] = useState("")

  return (
    <SettingsShell title={config.title} onClose={onClose} onSave={() => onUpdate({ ...block, title })}>
      {(activeTab) =>
        activeTab === "Content" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Details</h3>

                {/* Image */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Image</label>
                  <button className="w-full py-12 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-colors">
                    <Upload size={20} className="text-zinc-500" />
                    <span className="text-xs text-zinc-500 font-bold">Upload image</span>
                  </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe your offering..." className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium resize-none focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                </div>

                {/* Type-specific fields */}
                {block.type === "Appointment" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Duration (minutes)</label>
                      <div className="flex gap-2">
                        {["30", "45", "60", "90", "120"].map((d) => (
                          <button key={d} onClick={() => setDuration(d)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${duration === d ? "bg-emerald-500 text-black" : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"}`}>{d}m</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Location / Meeting Link</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Zoom / Google Meet link or address" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                  </>
                )}

                {block.type === "Event" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Event Date & Time</label>
                      <input type="datetime-local" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Location</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue or online link" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Max Capacity</label>
                      <input type="text" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Unlimited" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                  </>
                )}

                {block.type === "Supports" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Support Goal (optional)</label>
                      <input type="text" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="e.g. 5000000" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Thank You Message</label>
                      <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} rows={3} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium resize-none focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                  </>
                )}

                {block.type === "Affiliate" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Affiliate Link</label>
                      <input type="text" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} placeholder="https://..." className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Commission Rate (%)</label>
                      <input type="text" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                  </>
                )}

                {block.type === "Physical" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Weight (grams)</label>
                      <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 500" className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400">Shipping Notes</label>
                      <textarea value={shippingNote} onChange={(e) => setShippingNote(e.target.value)} rows={3} placeholder="Shipping details..." className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium resize-none focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700" />
                    </div>
                  </>
                )}

                {block.type === "Contact" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400">Collect Fields</label>
                    {["Email", "Phone", "Name", "Message"].map((field) => (
                      <div key={field} className="flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                          <span className="text-sm text-zinc-300 font-medium">{field}</span>
                        </label>
                        <Toggle value={true} onChange={() => {}} />
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "Course" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-400">Modules</h4>
                      <button className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:text-emerald-300 transition-colors"><Plus size={14} /> Add Module</button>
                    </div>
                    <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 text-center">
                      <p className="text-xs text-zinc-600 font-bold">No modules yet. Add your first module to get started.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing (for types that have it) */}
              {config.hasPrice && (
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Pricing</h3>
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
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800/50 space-y-4">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-wider">Advance Option</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-zinc-300">Enable Notification</span><Info size={12} className="text-zinc-600" /></div>
                  <Toggle value={enableNotification} onChange={setEnableNotification} />
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Active</span>
                  <Toggle value={isActive} onChange={setIsActive} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-12 border border-zinc-800/50 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center"><Info size={28} className="text-zinc-500" /></div>
            <p className="text-zinc-500 text-sm font-bold">Integrations coming soon</p>
          </div>
        )
      }
    </SettingsShell>
  )
}
