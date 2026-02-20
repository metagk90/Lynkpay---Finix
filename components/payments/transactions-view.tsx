"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatAmount(amount: number, currency: string) {
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
  SUCCEEDED: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Completed" },
  PENDING: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Pending" },
  FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Failed" },
  CANCELED: { icon: AlertTriangle, color: "text-zinc-500", bg: "bg-zinc-500/10", label: "Canceled" },
  UNKNOWN: { icon: AlertTriangle, color: "text-zinc-500", bg: "bg-zinc-500/10", label: "Unknown" },
}

interface Transfer {
  id: string
  created_at: string
  updated_at: string
  state: string
  amount: number
  currency: string
  type: string
  source?: string
  destination?: string
  tags?: Record<string, string>
  trace_id?: string
  statement_descriptor?: string
  fee?: number
  raw_amount?: number
}

interface TransferDetail extends Transfer {
  application: string
  merchant_identity: string
  idempotency_id: string | null
  messages: string[]
  subtype: string
}

export function TransactionsView({ currency = "USD", currencySymbol = "$" }: { currency?: string; currencySymbol?: string }) {
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null)

  const queryParams = new URLSearchParams()
  if (cursor) queryParams.set("after_cursor", cursor)
  queryParams.set("limit", "20")
  if (filter !== "All") queryParams.set("state", filter.toUpperCase())

  const { data, error, isLoading, mutate } = useSWR(`/api/finix/transfers?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: false,
  })

  const { data: detailData, isLoading: detailLoading } = useSWR(
    selectedTxn ? `/api/finix/transfers/${selectedTxn}` : null,
    fetcher
  )

  const transfers: Transfer[] = data?._embedded?.transfers || []
  const hasNext = !!data?._links?.next
  const hasPrev = !!cursor
  const nextCursor = data?._links?.next?.href?.match(/after_cursor=([^&]+)/)?.[1]

  const filtered = transfers.filter((t) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      t.id.toLowerCase().includes(s) ||
      (t.tags?.customer_email || "").toLowerCase().includes(s) ||
      (t.statement_descriptor || "").toLowerCase().includes(s)
    )
  })

  // Compute summary from current page
  const totalVolume = transfers.reduce((sum, t) => (t.state === "SUCCEEDED" ? sum + t.amount : sum), 0)
  const succeeded = transfers.filter((t) => t.state === "SUCCEEDED").length
  const pending = transfers.filter((t) => t.state === "PENDING").length
  const failed = transfers.filter((t) => t.state === "FAILED" || t.state === "CANCELED").length

  const detail: TransferDetail | null = detailData?.id ? detailData : null

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: isLoading ? "..." : formatAmount(totalVolume, currency), sub: "This page", color: "text-emerald-400" },
          { label: "Successful", value: isLoading ? "..." : String(succeeded), sub: `of ${transfers.length} transfers`, color: "text-emerald-400" },
          { label: "Pending", value: isLoading ? "..." : String(pending), sub: "Awaiting confirmation", color: "text-amber-400" },
          { label: "Failed / Canceled", value: isLoading ? "..." : String(failed), sub: "This page", color: "text-red-400" },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{card.label}</p>
            <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
            <p className="text-[11px] text-zinc-600 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Table */}
        <div className={`bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 ${selectedTxn ? "lg:flex-1" : "w-full"}`}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-5">
            <div className="flex gap-2 flex-wrap">
              {["All", "Succeeded", "Pending", "Failed", "Canceled"].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCursor(undefined) }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800/50 text-zinc-500 border border-zinc-800 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, email, descriptor..."
                  className="w-full md:w-64 pl-9 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <button onClick={() => mutate()} className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:border-emerald-500/30 transition-colors" title="Refresh">
                <RefreshCw size={14} className={`text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:border-emerald-500/30 transition-colors">
                <Download size={14} className="text-zinc-500" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              Failed to load transactions. Please check your API credentials in settings.
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Transfer ID</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Date</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hidden md:table-cell">Type</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hidden lg:table-cell">Descriptor</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Amount</th>
                  <th className="pb-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-800/30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4"><div className="h-4 bg-zinc-800/50 rounded animate-pulse w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((txn) => {
                    const s = STATUS_MAP[txn.state] || STATUS_MAP.UNKNOWN
                    const isDebit = txn.type === "DEBIT"
                    return (
                      <tr
                        key={txn.id}
                        onClick={() => setSelectedTxn(txn.id)}
                        className={`border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors cursor-pointer ${selectedTxn === txn.id ? "bg-zinc-800/30" : ""}`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isDebit ? "bg-emerald-400/10" : "bg-amber-400/10"}`}>
                              {isDebit ? <ArrowDownLeft size={14} className="text-emerald-400" /> : <ArrowUpRight size={14} className="text-amber-400" />}
                            </div>
                            <span className="text-xs font-mono text-zinc-400 truncate max-w-[140px]">{txn.id}</span>
                          </div>
                        </td>
                        <td className="py-4 text-xs text-zinc-500">{formatDate(txn.created_at)}</td>
                        <td className="py-4 text-xs text-zinc-400 uppercase hidden md:table-cell">{txn.type || "---"}</td>
                        <td className="py-4 text-xs text-zinc-400 hidden lg:table-cell">{txn.statement_descriptor || "---"}</td>
                        <td className="py-4 text-xs font-bold text-white text-right">{formatAmount(txn.amount, txn.currency)}</td>
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
                    <td colSpan={6} className="py-12 text-center text-zinc-600 text-sm">
                      {error ? "Error loading data" : "No transfers found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-800/50">
            <p className="text-[11px] text-zinc-600">
              Showing {filtered.length} transfer{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button
                disabled={!hasPrev}
                onClick={() => setCursor(undefined)}
                className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} className="text-zinc-400" />
              </button>
              <button
                disabled={!hasNext}
                onClick={() => nextCursor && setCursor(nextCursor)}
                className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} className="text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTxn && (
          <div className="lg:w-[380px] bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Transfer Detail</h3>
              <button onClick={() => setSelectedTxn(null)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
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
                {/* Status badge */}
                {(() => {
                  const s = STATUS_MAP[detail.state] || STATUS_MAP.UNKNOWN
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${s.bg} ${s.color}`}>
                      <s.icon size={13} />
                      {s.label}
                    </div>
                  )
                })()}

                <div className="space-y-4">
                  {[
                    { label: "Transfer ID", value: detail.id },
                    { label: "Amount", value: formatAmount(detail.amount, detail.currency) },
                    { label: "Fee", value: detail.fee != null ? formatAmount(detail.fee, detail.currency) : "---" },
                    { label: "Type", value: detail.type },
                    { label: "Subtype", value: detail.subtype || "---" },
                    { label: "Created", value: formatDate(detail.created_at) },
                    { label: "Updated", value: formatDate(detail.updated_at) },
                    { label: "Descriptor", value: detail.statement_descriptor || "---" },
                    { label: "Trace ID", value: detail.trace_id || "---" },
                    { label: "Source", value: detail.source || "---" },
                    { label: "Destination", value: detail.destination || "---" },
                    { label: "Application", value: detail.application || "---" },
                    { label: "Merchant Identity", value: detail.merchant_identity || "---" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest shrink-0">{row.label}</span>
                      <span className="text-xs text-zinc-300 text-right font-mono break-all">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                {detail.tags && Object.keys(detail.tags).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Tags</p>
                    <div className="space-y-1.5">
                      {Object.entries(detail.tags).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3">
                          <span className="text-[11px] text-zinc-500">{k}</span>
                          <span className="text-[11px] text-zinc-300 text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {detail.messages && detail.messages.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Messages</p>
                    <div className="space-y-1.5">
                      {detail.messages.map((msg, i) => (
                        <p key={i} className="text-[11px] text-amber-400/80 bg-amber-400/5 p-2 rounded-lg">{msg}</p>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">Ref: {detail.id}</span>
              </>
            ) : (
              <p className="text-xs text-zinc-600">Transfer details not available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
