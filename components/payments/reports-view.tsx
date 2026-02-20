"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatAmount(amount: number, currency?: string) {
  const val = amount / 100
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(val)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const STATUS_MAP: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  APPROVED: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Approved" },
  AWAITING_APPROVAL: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Awaiting" },
  PENDING: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Pending" },
  SUCCEEDED: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Succeeded" },
}

interface Settlement {
  id: string
  created_at: string
  updated_at: string
  status: string
  total_amount: number
  total_fee: number
  net_amount: number
  currency: string
  destination: string | null
  processor: string
  identity: string
  tags?: Record<string, string>
  total_fees?: number
}

export function ReportsView({ currency = "USD", currencySymbol = "$" }: { currency?: string; currencySymbol?: string }) {
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [selectedSettlement, setSelectedSettlement] = useState<string | null>(null)

  const queryParams = new URLSearchParams()
  if (cursor) queryParams.set("after_cursor", cursor)
  queryParams.set("limit", "20")

  const { data, error, isLoading, mutate } = useSWR(`/api/finix/settlements?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: false,
  })

  const { data: detailData, isLoading: detailLoading } = useSWR(
    selectedSettlement ? `/api/finix/settlements/${selectedSettlement}?include_transfers=true` : null,
    fetcher
  )

  const settlements: Settlement[] = data?._embedded?.settlements || []
  const hasNext = !!data?._links?.next
  const hasPrev = !!cursor
  const nextCursor = data?._links?.next?.href?.match(/after_cursor=([^&]+)/)?.[1]

  // Compute summaries from settlements list
  const totalGross = settlements.reduce((s, st) => s + (st.total_amount || 0), 0)
  const totalFees = settlements.reduce((s, st) => s + (st.total_fee || st.total_fees || 0), 0)
  const totalNet = settlements.reduce((s, st) => s + (st.net_amount || 0), 0)
  // Build chart data from settlements
  const chartData = settlements
    .slice()
    .reverse()
    .map((st) => ({
      name: new Date(st.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      gross: (st.total_amount || 0) / 100,
      fees: (st.total_fee || st.total_fees || 0) / 100,
      net: (st.net_amount || 0) / 100,
    }))

  const detail = detailData?.id ? detailData : null
  const detailTransfers = detailData?.settlement_transfers?._embedded?.transfers || []

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Volume", value: isLoading ? "..." : formatAmount(totalGross, currency), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Net Revenue", value: isLoading ? "..." : formatAmount(totalNet, currency), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Total Fees", value: isLoading ? "..." : formatAmount(totalFees, currency), icon: PieChart, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Settlements", value: isLoading ? "..." : String(settlements.length), icon: BarChart3, color: "text-sky-400", bg: "bg-sky-400/10" },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5">
            <div className={`${card.bg} w-8 h-8 rounded-xl flex items-center justify-center mb-3`}>
              <card.icon size={16} className={card.color} />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{card.label}</p>
            <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white uppercase tracking-wide mb-1">Settlement Overview</h3>
          <p className="text-[11px] text-zinc-600 mb-6">Gross, net, and fees per settlement</p>
          <div className="h-56" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={224}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a33" />
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px", fontSize: "11px" }}
                  labelStyle={{ color: "#a1a1aa" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Bar dataKey="gross" fill="#10b981" radius={[6, 6, 0, 0]} name="Gross" />
                <Bar dataKey="fees" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Fees" />
                <Bar dataKey="net" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Net" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Gross</div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Fees</div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold"><span className="w-2.5 h-2.5 rounded bg-sky-500" /> Net</div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settlements Table */}
        <div className={`bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 ${selectedSettlement ? "lg:flex-1" : "w-full"}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wide">Settlements</h3>
            <button onClick={() => mutate()} className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:border-emerald-500/30 transition-colors" title="Refresh">
              <RefreshCw size={14} className={`text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              Failed to load settlements. Please check your API credentials in settings.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Settlement ID</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Date</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hidden md:table-cell">Gross</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hidden lg:table-cell">Fees</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Net</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-800/30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4"><div className="h-4 bg-zinc-800/50 rounded animate-pulse w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : settlements.length > 0 ? (
                  settlements.map((st) => {
                    const s = STATUS_MAP[st.status] || { icon: Clock, color: "text-zinc-500", bg: "bg-zinc-500/10", label: st.status }
                    return (
                      <tr
                        key={st.id}
                        onClick={() => setSelectedSettlement(st.id)}
                        className={`border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors cursor-pointer ${selectedSettlement === st.id ? "bg-zinc-800/30" : ""}`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-emerald-400/10">
                              <FileText size={14} className="text-emerald-400" />
                            </div>
                            <span className="text-xs font-mono text-zinc-400 truncate max-w-[130px]">{st.id}</span>
                          </div>
                        </td>
                        <td className="py-4 text-xs text-zinc-500">{formatDate(st.created_at)}</td>
                        <td className="py-4 text-xs text-zinc-400 hidden md:table-cell">{formatAmount(st.total_amount, st.currency)}</td>
                        <td className="py-4 text-xs text-amber-400/80 hidden lg:table-cell">{formatAmount(st.total_fee || st.total_fees || 0, st.currency)}</td>
                        <td className="py-4 text-xs font-bold text-white text-right">{formatAmount(st.net_amount, st.currency)}</td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${s.bg} ${s.color}`}>
                              <s.icon size={11} />
                              {s.label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-600 text-sm">No settlements found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800/50">
            <p className="text-[11px] text-zinc-600">Showing {settlements.length} settlement{settlements.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button disabled={!hasPrev} onClick={() => setCursor(undefined)} className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={14} className="text-zinc-400" />
              </button>
              <button disabled={!hasNext} onClick={() => nextCursor && setCursor(nextCursor)} className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={14} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedSettlement && (
          <div className="lg:w-[400px] bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Settlement Detail</h3>
              <button onClick={() => setSelectedSettlement(null)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={16} className="text-zinc-500" />
              </button>
            </div>

            {detailLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 bg-zinc-800/50 rounded animate-pulse" />
                ))}
              </div>
            ) : detail ? (
              <>
                {(() => {
                  const s = STATUS_MAP[detail.status] || { icon: Clock, color: "text-zinc-500", bg: "bg-zinc-500/10", label: detail.status }
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${s.bg} ${s.color}`}>
                      <s.icon size={13} />
                      {s.label}
                    </div>
                  )
                })()}

                <div className="space-y-4">
                  {[
                    { label: "Settlement ID", value: detail.id },
                    { label: "Gross Amount", value: formatAmount(detail.total_amount, detail.currency) },
                    { label: "Fees", value: formatAmount(detail.total_fee || detail.total_fees || 0, detail.currency) },
                    { label: "Net Amount", value: formatAmount(detail.net_amount, detail.currency) },
                    { label: "Currency", value: detail.currency },
                    { label: "Created", value: formatDate(detail.created_at) },
                    { label: "Updated", value: formatDate(detail.updated_at) },
                    { label: "Processor", value: detail.processor || "---" },
                    { label: "Identity", value: detail.identity || "---" },
                    { label: "Destination", value: detail.destination || "---" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest shrink-0">{row.label}</span>
                      <span className="text-xs text-zinc-300 text-right font-mono break-all">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Included Transfers */}
                {detailTransfers.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800/50">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Included Transfers ({detailTransfers.length})</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      {detailTransfers.map((t: { id: string; amount: number; currency: string; state: string }) => (
                        <div key={t.id} className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                          <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[160px]">{t.id}</span>
                          <span className="text-[11px] font-bold text-white">{formatAmount(t.amount, t.currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detail.tags && Object.keys(detail.tags).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Tags</p>
                    <div className="space-y-1.5">
                      {Object.entries(detail.tags).map(([k, v]: [string, unknown]) => (
                        <div key={k} className="flex justify-between gap-3">
                          <span className="text-[11px] text-zinc-500">{k}</span>
                          <span className="text-[11px] text-zinc-300 text-right">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">Ref: {detail.id}</span>
              </>
            ) : (
              <p className="text-xs text-zinc-600">Settlement details not available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
