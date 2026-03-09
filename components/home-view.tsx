"use client"

import {
  Zap,
  Plus,
  Share2,
  ExternalLink,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  Package,
  FileText,
  GraduationCap,
  Globe,
  Calendar,
  MousePointerClick,
  DollarSign,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { MetricsFilter } from "@/components/metrics-filter"

interface ChartDataPoint {
  name: string
  views: number
  clicks: number
}

interface AnalyticsData {
  totals: { views: number; clicks: number; purchases: number; uniqueVisitors: number; clickRate: string }
  changes: { views: string; clicks: string; purchases: string }
  chartData: { date: string; views: number; clicks: number; purchases: number }[]
  topBlocks: { blockId: number; blockTitle: string; blockType: string; clicks: number }[]
}

interface HomeViewProps {
  chartData: ChartDataPoint[]
  currency?: string
  currencySymbol?: string
  userName?: string
  userEmail?: string
  analytics?: AnalyticsData
}

export function HomeView({ chartData, currency = "USD", currencySymbol = "$", userName = "", userEmail = "", analytics }: HomeViewProps) {
  const displayName = userName || "Creator"
  const avatarSeed = userName || "User"
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <span className="font-bold text-zinc-500 text-xs uppercase tracking-widest">Account</span>
              <span className="bg-emerald-500 border border-emerald-500/20 text-white text-[10px] px-2.5 py-0.5 rounded-md font-black flex items-center gap-1.5 uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Zap size={10} fill="currentColor" /> Pro
              </span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center bg-zinc-800/50 hover:bg-emerald-500 hover:text-black text-zinc-100 rounded-full transition-all duration-300">
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-black/60 p-6 rounded-3xl border border-zinc-800/50 shadow-inner group gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-800 border-4 border-zinc-900 shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`} alt="avatar" crossOrigin="anonymous" />
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 border-4 border-zinc-900 rounded-full" />
              </div>
              <div>
                <h3 className="font-black text-xl md:text-2xl text-white tracking-tight">{displayName}</h3>
                {userEmail && (
                  <span className="text-zinc-500 text-sm truncate max-w-[200px]">{userEmail}</span>
                )}
                <a
                  href="#"
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-sm"
                >
                  {`lynkpay.co/${displayName.toLowerCase().replace(/\s+/g, "")}`}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-500 text-emerald-500 rounded-full font-black text-sm hover:bg-emerald-500 hover:text-black transition-all duration-300">
              <Share2 size={18} /> Share
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{"Start creating now!"}</p>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {[
                { icon: LinkIcon, label: "Add Link" },
                { icon: Package, label: "Digital Product" },
                { icon: FileText, label: "Blog Content" },
                { icon: GraduationCap, label: "Course Video" },
                { icon: Globe, label: "Media Kit" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2.5 px-5 py-3 border border-zinc-800 bg-zinc-900/50 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-sm font-bold text-zinc-300 whitespace-nowrap group"
                >
                  <action.icon size={18} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <TrendingUp size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-sm text-white">Earnings</span>
                </div>
              </div>
              <Eye size={18} className="text-white opacity-60 cursor-pointer" />
            </div>

            <div className="mb-6 flex-1">
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2 italic">{`${currencySymbol} \u2014\u2014.\u2014\u2014`}</h2>
              <div className="h-1.5 w-2/3 bg-white/30 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-white w-2/3" />
              </div>
            </div>

            <button className="text-xs font-black text-white underline decoration-2 underline-offset-4 mb-10 hover:opacity-80 transition-opacity text-left">
              Payout Setting Page
            </button>

            <div className="bg-white rounded-2xl p-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">PayMe Link</span>
                  <span className="text-emerald-800 text-xs font-bold leading-tight">Verify your account to activate</span>
                </div>
                <button className="bg-emerald-500 text-white p-2 rounded-xl hover:scale-110 active:scale-90 transition-all">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-10 right-[-20px] opacity-10 rotate-12 text-white">
            <Zap size={140} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Metrics Filter */}
      <MetricsFilter />

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Page Views",
            value: analytics?.totals.views.toLocaleString() ?? "0",
            change: analytics?.changes.views ?? "+0%",
            trend: (analytics?.changes.views?.startsWith("-") ? "down" : "up") as const,
            icon: Eye,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
          },
          {
            label: "Total Sales",
            value: analytics?.totals.purchases.toLocaleString() ?? "0",
            change: analytics?.changes.purchases ?? "+0%",
            trend: (analytics?.changes.purchases?.startsWith("-") ? "down" : "up") as const,
            icon: ShoppingCart,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
          },
          {
            label: "Click Rate",
            value: `${analytics?.totals.clickRate ?? "0"}%`,
            change: analytics?.changes.clicks ?? "+0%",
            trend: (analytics?.changes.clicks?.startsWith("-") ? "down" : "up") as const,
            icon: DollarSign,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
          },
          {
            label: "Unique Visitors",
            value: analytics?.totals.uniqueVisitors.toLocaleString() ?? "0",
            change: analytics?.changes.views ?? "+0%",
            trend: (analytics?.changes.views?.startsWith("-") ? "down" : "up") as const,
            icon: Users,
            color: "text-sky-400",
            bgColor: "bg-sky-400/10",
            borderColor: "border-sky-400/20",
          },
        ].map((metric, i) => (
          <div
            key={i}
            className={`bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex flex-col gap-3 hover:border-zinc-700/50 transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <div className={`${metric.bgColor} ${metric.borderColor} border p-2 rounded-xl`}>
                <metric.icon size={16} className={metric.color} />
              </div>
              <div
                className={`flex items-center gap-0.5 text-[11px] font-bold ${
                  metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {metric.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{metric.label}</p>
              <p className="text-xl font-black text-white tracking-tight">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Click Rate",
            value: `${analytics?.totals.clickRate ?? "0"}%`,
            change: analytics?.changes.clicks ?? "+0%",
            trend: (analytics?.changes.clicks?.startsWith("-") ? "down" : "up") as const,
            icon: MousePointerClick,
            color: "text-violet-400",
            bgColor: "bg-violet-400/10",
            borderColor: "border-violet-400/20",
          },
          {
            label: "Total Clicks",
            value: analytics?.totals.clicks.toLocaleString() ?? "0",
            change: analytics?.changes.clicks ?? "+0%",
            trend: (analytics?.changes.clicks?.startsWith("-") ? "down" : "up") as const,
            icon: DollarSign,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
          },
          {
            label: "Link Clicks",
            value: analytics?.totals.clicks.toLocaleString() ?? "0",
            change: analytics?.changes.clicks ?? "+0%",
            trend: (analytics?.changes.clicks?.startsWith("-") ? "down" : "up") as const,
            icon: LinkIcon,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
          },
          {
            label: "Purchases",
            value: analytics?.totals.purchases.toLocaleString() ?? "0",
            change: analytics?.changes.purchases ?? "+0%",
            trend: (analytics?.changes.purchases?.startsWith("-") ? "down" : "up") as const,
            icon: Users,
            color: "text-rose-400",
            bgColor: "bg-rose-400/10",
            borderColor: "border-rose-400/20",
          },
        ].map((metric, i) => (
          <div
            key={i}
            className={`bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex flex-col gap-3 hover:border-zinc-700/50 transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <div className={`${metric.bgColor} ${metric.borderColor} border p-2 rounded-xl`}>
                <metric.icon size={16} className={metric.color} />
              </div>
              <div
                className={`flex items-center gap-0.5 text-[11px] font-bold ${
                  metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {metric.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{metric.label}</p>
              <p className="text-xl font-black text-white tracking-tight">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">{"Total Views & Clicks"}</h2>
            <div className="flex gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Views</span>
                <span className="text-2xl font-black text-amber-400">{analytics?.totals.views.toLocaleString() ?? "0"}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800 self-end mb-1" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Clicks</span>
                <span className="text-2xl font-black text-emerald-500">{analytics?.totals.clicks.toLocaleString() ?? "0"}</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 border border-zinc-800 bg-black/40 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white transition-all">
            <Calendar size={18} className="text-zinc-600" />
            {"Select Date..."}
          </button>
        </div>

        <div className="h-[250px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} barGap={-24}>
              <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }}
                dy={15}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} />
              <Tooltip
                cursor={{ fill: "#18181b", radius: 8 }}
                contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a" }}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]} barSize={10}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="#fbbf24" fillOpacity={0.8} />
                ))}
              </Bar>
              <Bar dataKey="clicks" radius={[6, 6, 0, 0]} barSize={10}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="#10b981" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
