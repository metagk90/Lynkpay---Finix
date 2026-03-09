"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Calendar as CalendarIcon,
  Download,
  ChevronDown,
  Search,
  User,
  FileText,
  ExternalLink,
  Share2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Copy,
  Package,
} from "lucide-react"

interface Order {
  id: string
  date: string
  status: "EXPIRED" | "COMPLETED" | "PENDING"
  customer: string
  customerName: string
  product: string
  productType: string
  total: string
  rawAmount: number
  currency: string
  image: string | null
}

const TRANSACTION_FILTERS = ["All Transaction", "Completed", "Pending", "Expired"]
const SEARCH_FIELDS = ["Product Title", "Customer Email", "Order ID"]

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles = {
    EXPIRED: "text-red-400",
    COMPLETED: "text-emerald-400",
    PENDING: "text-amber-400",
  }
  return (
    <span className={`text-xs font-black uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  )
}

export function OrdersView({ userName = "" }: { userName?: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [transactionFilter, setTransactionFilter] = useState("All Transaction")
  const [searchField, setSearchField] = useState("Product Title")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showTransactionDropdown, setShowTransactionDropdown] = useState(false)
  const [showSearchFieldDropdown, setShowSearchFieldDropdown] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [copied, setCopied] = useState(false)

  const profileUrl = userName ? `${typeof window !== "undefined" ? window.location.origin : ""}/${userName}` : ""

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (transactionFilter !== "All Transaction") params.set("status", transactionFilter)
    if (searchQuery) {
      params.set("search", searchQuery)
      params.set("searchField", searchField)
    }
    params.set("page", page.toString())
    params.set("limit", "10")

    try {
      const res = await fetch(`/api/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
        setTotalPages(data.totalPages || 1)
        setTotalOrders(data.total || 0)
      }
    } catch {
      /* silent */
    } finally {
      setIsLoading(false)
    }
  }, [transactionFilter, searchQuery, searchField, page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [transactionFilter, searchQuery, searchField])

  const allSelected = orders.length > 0 && selectedOrders.length === orders.length
  const toggleSelectAll = () => {
    setSelectedOrders(allSelected ? [] : orders.map((o) => o.id))
  }
  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleCopyUrl = async () => {
    if (!profileUrl) return
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSV = () => {
    if (!orders.length) return
    const headers = ["Order ID", "Date", "Status", "Customer", "Product", "Type", "Total"]
    const rows = orders.map((o) => [o.id, o.date, o.status, o.customer, o.product, o.productType, o.total])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* URL Bar */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/50 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-zinc-500 whitespace-nowrap">My Lynk:</span>
          <a
            href={profileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-emerald-400 truncate hover:underline"
          >
            {userName ? `lynkpay.co/${userName}` : "Set up your username"}
          </a>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyUrl}
            disabled={!userName}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/10 transition-all disabled:opacity-40"
          >
            {copied ? <><Check size={14} /> Copied</> : <><Share2 size={14} /> Share</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: Product Orders */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white tracking-tight">Product Orders</h2>
            <span className="text-xs font-bold text-zinc-500">{totalOrders} total</span>
          </div>

          {/* Date + Export Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3">
              <CalendarIcon size={16} className="text-zinc-500 shrink-0" />
              <span className="text-sm text-zinc-500 font-semibold">Lifetime Data</span>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={!orders.length}
              className="bg-emerald-500 hover:bg-emerald-400 text-black p-3 rounded-xl transition-all shrink-0 disabled:opacity-40"
            >
              <Download size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Transaction Filter Dropdown */}
          <div className="relative mb-4">
            <button
              onClick={() => setShowTransactionDropdown(!showTransactionDropdown)}
              className="w-full flex items-center justify-between bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-700 transition-all"
            >
              {transactionFilter}
              <ChevronDown size={16} className={`text-zinc-500 transition-transform ${showTransactionDropdown ? "rotate-180" : ""}`} />
            </button>
            {showTransactionDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-20 shadow-2xl">
                {TRANSACTION_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setTransactionFilter(filter)
                      setShowTransactionDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                      transactionFilter === filter ? "text-emerald-400" : "text-zinc-400"
                    }`}
                  >
                    {filter}
                    {transactionFilter === filter && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Row */}
          <div className="flex items-stretch gap-0 mb-4">
            <div className="relative">
              <button
                onClick={() => setShowSearchFieldDropdown(!showSearchFieldDropdown)}
                className="h-full flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/50 border-r-0 rounded-l-xl px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800/50 transition-all whitespace-nowrap"
              >
                {searchField}
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showSearchFieldDropdown ? "rotate-180" : ""}`} />
              </button>
              {showSearchFieldDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-20 shadow-2xl min-w-[180px]">
                  {SEARCH_FIELDS.map((field) => (
                    <button
                      key={field}
                      onClick={() => {
                        setSearchField(field)
                        setShowSearchFieldDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                        searchField === field ? "text-emerald-400" : "text-zinc-400"
                      }`}
                    >
                      {field}
                      {searchField === field && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center bg-zinc-900/60 border border-zinc-800/50 rounded-r-xl px-4 py-3 gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
              />
              <Search size={16} className="text-zinc-500 shrink-0" />
            </div>
          </div>

          {/* Selection Bar */}
          <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  allSelected
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {allSelected && <Check size={12} className="text-black" strokeWidth={3} />}
              </button>
              <span className="text-sm font-semibold text-zinc-400">
                ({selectedOrders.length}) Selected
              </span>
              <span className="text-xs font-bold text-emerald-400 ml-2">
                Displaying : Lifetime Data
              </span>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={32} className="text-emerald-500 animate-spin mb-4" />
              <p className="text-sm font-semibold text-zinc-500">Loading orders...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
              <Package size={40} className="mb-4" />
              <p className="text-sm font-semibold text-zinc-400">No orders yet</p>
              <p className="text-xs text-zinc-600 mt-1">
                Orders will appear here when customers purchase from your profile.
              </p>
            </div>
          )}

          {/* Order List */}
          {!isLoading && (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-zinc-900/40 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 ${
                    selectedOrder?.id === order.id
                      ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                      : "border-zinc-800/50 hover:border-zinc-700/50"
                  }`}
                >
                  {/* Date + Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSelect(order.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                          selectedOrders.includes(order.id)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-zinc-700 hover:border-zinc-500"
                        }`}
                      >
                        {selectedOrders.includes(order.id) && (
                          <Check size={12} className="text-black" strokeWidth={3} />
                        )}
                      </button>
                      <span className="text-xs font-semibold text-zinc-500">{order.date}</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <User size={14} className="text-zinc-500" />
                      <span className="text-xs text-zinc-400">
                        Customer: <span className="text-zinc-200 font-bold">{order.customer}</span>
                      </span>
                    </div>
                  </div>

                  {/* Product + Total */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
                        {order.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={order.image}
                            alt={order.product}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <Package size={20} className="text-zinc-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{order.product}</p>
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase">
                          {order.productType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Total</p>
                        <p className="text-sm font-black text-white">{order.total}</p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black transition-all"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-bold text-zinc-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Order Details Panel */}
        <div className="xl:w-[380px] shrink-0">
          <div className="sticky top-10">
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-zinc-800/50 min-h-[500px]">
              <div className="px-6 py-4 border-b border-zinc-800/50">
                <h3 className="text-sm font-black text-white tracking-tight">Order Details</h3>
              </div>

              {selectedOrder ? (
                <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <StatusBadge status={selectedOrder.status} />
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-300"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
                      {selectedOrder.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedOrder.image}
                          alt={selectedOrder.product}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <Package size={28} className="text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedOrder.product}</p>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded uppercase">
                        {selectedOrder.productType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/30">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Customer</p>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-zinc-500" />
                        <p className="text-sm font-bold text-zinc-200">{selectedOrder.customer}</p>
                      </div>
                      {selectedOrder.customerName && (
                        <p className="text-xs text-zinc-500 mt-1 ml-6">{selectedOrder.customerName}</p>
                      )}
                    </div>

                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/30">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Order Date</p>
                      <p className="text-sm font-bold text-zinc-200">{selectedOrder.date}</p>
                    </div>

                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/30">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Transaction</p>
                      <p className="text-lg font-black text-emerald-400">{selectedOrder.total}</p>
                    </div>

                    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/30">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Order ID</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono text-zinc-200 truncate mr-2">{selectedOrder.id}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(selectedOrder.id)}
                          className="p-1 rounded hover:bg-zinc-700 transition-colors text-zinc-500 hover:text-zinc-300 shrink-0"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center mb-5">
                    <FileText size={28} className="text-zinc-600" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-500 text-center leading-relaxed">
                    Your transaction detail will appear here.
                  </p>
                  <p className="text-xs text-zinc-600 text-center mt-1">
                    Click <span className="text-emerald-400 font-bold">Detail</span> button on the left side.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
