"use client"

import {
  Eye,
  MousePointerClick,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Link as LinkIcon,
  Clock,
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
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts"
import { MetricsFilter } from "@/components/metrics-filter"

interface MetricCardProps {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
}

function MetricCard({ label, value, change, trend, icon: Icon, color, bgColor, borderColor }: MetricCardProps) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/50 flex flex-col gap-3 hover:border-zinc-700/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`${bgColor} ${borderColor} border p-2 rounded-xl`}>
          <Icon size={16} className={color} />
        </div>
        <div
          className={`flex items-center gap-0.5 text-[11px] font-bold ${
            trend === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
  )
}

interface AnalyticsData {
  totals: { views: number; clicks: number; purchases: number; uniqueVisitors: number; clickRate: string }
  changes: { views: string; clicks: string; purchases: string }
  chartData: { date: string; views: number; clicks: number; purchases: number }[]
  topBlocks: { blockId: number; blockTitle: string; blockType: string; clicks: number }[]
  deviceBreakdown?: { name: string; value: number }[]
  hourlyDistribution?: { hour: string; visitors: number }[]
}

const DEVICE_COLORS: Record<string, string> = {
  Mobile: "#10b981",
  Desktop: "#fbbf24",
  Tablet: "#38bdf8",
}

export function StatisticsView({ currency = "USD", currencySymbol = "$", analytics }: { currency?: string; currencySymbol?: string; analytics?: AnalyticsData }) {
  const t = analytics?.totals
  const c = analytics?.changes

  const metrics: MetricCardProps[] = [
    {
      label: "Total Views",
      value: t?.views.toLocaleString() ?? "0",
      change: c?.views ?? "0%",
      trend: c?.views?.startsWith("-") ? "down" : "up",
      icon: Eye,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      label: "Total Clicks",
      value: t?.clicks.toLocaleString() ?? "0",
      change: c?.clicks ?? "0%",
      trend: c?.clicks?.startsWith("-") ? "down" : "up",
      icon: MousePointerClick,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Unique Visitors",
      value: t?.uniqueVisitors.toLocaleString() ?? "0",
      change: c?.views ?? "0%",
      trend: c?.views?.startsWith("-") ? "down" : "up",
      icon: Users,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
      borderColor: "border-sky-400/20",
    },
    {
      label: "Total Sales",
      value: t?.purchases.toLocaleString() ?? "0",
      change: c?.purchases ?? "0%",
      trend: c?.purchases?.startsWith("-") ? "down" : "up",
      icon: ShoppingCart,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Click Rate",
      value: `${t?.clickRate ?? "0"}%`,
      change: c?.clicks ?? "0%",
      trend: c?.clicks?.startsWith("-") ? "down" : "up",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Conversion",
      value: t && t.views > 0 ? `${((t.purchases / t.views) * 100).toFixed(1)}%` : "0%",
      change: c?.purchases ?? "0%",
      trend: c?.purchases?.startsWith("-") ? "down" : "up",
      icon: TrendingUp,
      color: "text-rose-400",
      bgColor: "bg-rose-400/10",
      borderColor: "border-rose-400/20",
    },
  ]

  // Traffic chart data from real analytics
  const trafficChartData = analytics?.chartData?.length
    ? analytics.chartData.slice(-7).map((d) => ({
        name: d.date.slice(5).replace("-", " "),
        views: d.views,
        clicks: d.clicks,
      }))
    : []

  // Purchase/revenue chart from real analytics
  const purchaseChartData = analytics?.chartData?.length
    ? analytics.chartData.slice(-7).map((d) => ({
        name: d.date.slice(5).replace("-", " "),
        purchases: d.purchases,
      }))
    : []

  // Device breakdown from real analytics
  const deviceData = analytics?.deviceBreakdown?.length
    ? analytics.deviceBreakdown.map((d) => ({
        name: d.name,
        value: d.value,
        color: DEVICE_COLORS[d.name] || "#6b7280",
      }))
    : [
        { name: "Mobile", value: 0, color: "#10b981" },
        { name: "Desktop", value: 0, color: "#fbbf24" },
        { name: "Tablet", value: 0, color: "#38bdf8" },
      ]

  // Top links from real analytics
  const topLinks = analytics?.topBlocks?.length
    ? analytics.topBlocks.map((b) => ({ name: b.blockTitle || "Untitled", clicks: b.clicks }))
    : []

  // Hourly distribution from real analytics
  const hourlyData = analytics?.hourlyDistribution?.length
    ? analytics.hourlyDistribution
    : []

  const hasTrafficData = trafficChartData.length > 0
  const hasPurchaseData = purchaseChartData.some((d) => d.purchases > 0)
  const hasDeviceData = deviceData.some((d) => d.value > 0)
  const hasTopLinks = topLinks.length > 0
  const hasHourlyData = hourlyData.length > 0

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Filter */}
      <MetricsFilter />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Traffic Overview Chart */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Traffic Overview</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Views and clicks over the past week</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold text-zinc-500">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-zinc-500">Clicks</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full" style={{ minWidth: 0 }}>
          {hasTrafficData ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trafficChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
                <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: "#18181b", radius: 8 }}
                  contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
                />
                <Bar dataKey="views" radius={[6, 6, 0, 0]} barSize={14}>
                  {trafficChartData.map((_, i) => (
                    <Cell key={i} fill="#fbbf24" fillOpacity={0.85} />
                  ))}
                </Bar>
                <Bar dataKey="clicks" radius={[6, 6, 0, 0]} barSize={14}>
                  {trafficChartData.map((_, i) => (
                    <Cell key={i} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm font-bold text-zinc-600">No traffic data yet. Share your profile to start tracking.</p>
            </div>
          )}
        </div>
      </div>

      {/* Purchases + Device Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Purchase Trend */}
        <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Purchase Trend</h2>
              <p className="text-xs text-zinc-500 font-semibold mt-1">Daily purchases for the current period</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-xs font-black text-emerald-400">{c?.purchases ?? "0%"} vs last period</span>
            </div>
          </div>
          <div className="h-[240px] w-full" style={{ minWidth: 0 }}>
            {hasPurchaseData ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={purchaseChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
                    formatter={(value: number) => [`${value} purchases`, "Sales"]}
                  />
                  <Area type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2.5} fill="url(#revGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm font-bold text-zinc-600">No purchase data yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <h2 className="text-lg font-black text-white tracking-tight mb-2">Device Breakdown</h2>
          <p className="text-xs text-zinc-500 font-semibold mb-6">Where your visitors come from</p>

          <div className="h-[180px] w-full flex items-center justify-center" style={{ minWidth: 0 }}>
            {hasDeviceData ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm font-bold text-zinc-600">No device data yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {deviceData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${d.color}15` }}>
                    {d.name === "Mobile" ? (
                      <Smartphone size={14} style={{ color: d.color }} />
                    ) : d.name === "Desktop" ? (
                      <Monitor size={14} style={{ color: d.color }} />
                    ) : (
                      <Globe size={14} style={{ color: d.color }} />
                    )}
                  </div>
                  <span className="text-sm font-bold text-zinc-300">{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                  <span className="text-sm font-black text-zinc-400 w-10 text-right">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Links */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Top Links</h2>
              <p className="text-xs text-zinc-500 font-semibold mt-1">Most clicked blocks in this period</p>
            </div>
            <LinkIcon size={18} className="text-zinc-600" />
          </div>

          {hasTopLinks ? (
            <div className="flex flex-col gap-3">
              {topLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-zinc-800/30 border border-zinc-800/30 rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-zinc-600 w-5">{i + 1}.</span>
                    <span className="text-sm font-bold text-zinc-200">{link.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-400">{link.clicks.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-zinc-600 text-center py-8">No link click data yet.</p>
          )}
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Peak Hours</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">When your audience is most active (UTC, 24h format)</p>
          </div>
          <Clock size={18} className="text-zinc-600" />
        </div>

        <div className="h-[200px] w-full" style={{ minWidth: 0 }}>
          {hasHourlyData ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
                  formatter={(value: number) => [`${value} visitors`, "Active"]}
                />
                <Area type="monotone" dataKey="visitors" stroke="#fbbf24" strokeWidth={2.5} fill="url(#hourGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm font-bold text-zinc-600">No hourly data yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
