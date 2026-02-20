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
  MapPin,
  Clock,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const dailyTrafficData = [
  { name: "Mon", views: 420, clicks: 180, visitors: 310 },
  { name: "Tue", views: 380, clicks: 165, visitors: 280 },
  { name: "Wed", views: 510, clicks: 230, visitors: 390 },
  { name: "Thu", views: 680, clicks: 320, visitors: 520 },
  { name: "Fri", views: 590, clicks: 275, visitors: 440 },
  { name: "Sat", views: 350, clicks: 140, visitors: 260 },
  { name: "Sun", views: 290, clicks: 110, visitors: 200 },
]

const revenueData = [
  { name: "08 Feb", revenue: 120000 },
  { name: "09 Feb", revenue: 340000 },
  { name: "10 Feb", revenue: 280000 },
  { name: "11 Feb", revenue: 890000 },
  { name: "12 Feb", revenue: 450000 },
  { name: "13 Feb", revenue: 670000 },
  { name: "14 Feb", revenue: 520000 },
]

const deviceData = [
  { name: "Mobile", value: 64, color: "#10b981" },
  { name: "Desktop", value: 28, color: "#fbbf24" },
  { name: "Tablet", value: 8, color: "#38bdf8" },
]

const topLinksData = [
  { name: "Viral VFX Pro", clicks: 847, views: 1240 },
  { name: "Bio Link", clicks: 523, views: 890 },
  { name: "YouTube Channel", clicks: 312, views: 670 },
  { name: "Instagram", clicks: 289, views: 540 },
  { name: "Twitter/X", clicks: 175, views: 380 },
]

const topCountries = [
  { country: "Indonesia", visitors: 1420, pct: 42 },
  { country: "United States", visitors: 680, pct: 20 },
  { country: "India", visitors: 510, pct: 15 },
  { country: "Malaysia", visitors: 340, pct: 10 },
  { country: "Singapore", visitors: 238, pct: 7 },
]

const hourlyData = [
  { hour: "00", visitors: 12 },
  { hour: "02", visitors: 8 },
  { hour: "04", visitors: 5 },
  { hour: "06", visitors: 18 },
  { hour: "08", visitors: 45 },
  { hour: "10", visitors: 78 },
  { hour: "12", visitors: 95 },
  { hour: "14", visitors: 88 },
  { hour: "16", visitors: 72 },
  { hour: "18", visitors: 64 },
  { hour: "20", visitors: 52 },
  { hour: "22", visitors: 28 },
]

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

export function StatisticsView({ currency = "USD", currencySymbol = "$" }: { currency?: string; currencySymbol?: string }) {
  const metrics: MetricCardProps[] = [
    {
      label: "Total Views",
      value: "12,847",
      change: "+14.2%",
      trend: "up",
      icon: Eye,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      label: "Total Clicks",
      value: "5,432",
      change: "+9.8%",
      trend: "up",
      icon: MousePointerClick,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Unique Visitors",
      value: "3,891",
      change: "+6.1%",
      trend: "up",
      icon: Users,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
      borderColor: "border-sky-400/20",
    },
    {
      label: "Total Sales",
      value: "284",
      change: "+18.3%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Revenue",
      value: `${currencySymbol}25.6K`,
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Click Rate",
      value: "42.3%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-rose-400",
      bgColor: "bg-rose-400/10",
      borderColor: "border-rose-400/20",
    },
  ]

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
            <p className="text-xs text-zinc-500 font-semibold mt-1">Views, clicks, and unique visitors over the past week</p>
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
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-[11px] font-bold text-zinc-500">Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyTrafficData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
              <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} />
              <Tooltip
                cursor={{ fill: "#18181b", radius: 8 }}
                contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]} barSize={14}>
                {dailyTrafficData.map((_, i) => (
                  <Cell key={i} fill="#fbbf24" fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar dataKey="clicks" radius={[6, 6, 0, 0]} barSize={14}>
                {dailyTrafficData.map((_, i) => (
                  <Cell key={i} fill="#10b981" />
                ))}
              </Bar>
              <Bar dataKey="visitors" radius={[6, 6, 0, 0]} barSize={14}>
                {dailyTrafficData.map((_, i) => (
                  <Cell key={i} fill="#38bdf8" fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue + Device Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Revenue Trend</h2>
              <p className="text-xs text-zinc-500 font-semibold mt-1">Daily revenue for the current period</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-xs font-black text-emerald-400">+23.1% vs last period</span>
            </div>
          </div>
          <div className="h-[240px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", borderRadius: "16px", border: "1px solid #27272a", fontSize: "12px", fontWeight: 700 }}
                  formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <h2 className="text-lg font-black text-white tracking-tight mb-2">Device Breakdown</h2>
          <p className="text-xs text-zinc-500 font-semibold mb-6">Where your visitors come from</p>

          <div className="h-[180px] w-full flex items-center justify-center" style={{ minWidth: 0 }}>
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

      {/* Top Links + Top Countries Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Links */}
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Top Links</h2>
              <p className="text-xs text-zinc-500 font-semibold mt-1">Most clicked links in this period</p>
            </div>
            <LinkIcon size={18} className="text-zinc-600" />
          </div>

          <div className="flex flex-col gap-3">
            {topLinksData.map((link, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-zinc-800/30 border border-zinc-800/30 rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-zinc-600 w-5">{i + 1}.</span>
                  <span className="text-sm font-bold text-zinc-200">{link.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-400">{link.clicks.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">clicks</p>
                  </div>
                  <div className="w-px h-6 bg-zinc-800" />
                  <div className="text-right">
                    <p className="text-xs font-black text-amber-400">{link.views.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Top Countries</h2>
              <p className="text-xs text-zinc-500 font-semibold mt-1">Visitor distribution by country</p>
            </div>
            <MapPin size={18} className="text-zinc-600" />
          </div>

          <div className="flex flex-col gap-3">
            {topCountries.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-zinc-800/30 border border-zinc-800/30 rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-zinc-600 w-5">{i + 1}.</span>
                  <span className="text-sm font-bold text-zinc-200">{c.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-zinc-400">{c.visitors.toLocaleString()} visitors</span>
                  <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-zinc-400 w-8 text-right">{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800/50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Peak Hours</h2>
            <p className="text-xs text-zinc-500 font-semibold mt-1">When your audience is most active (24h format)</p>
          </div>
          <Clock size={18} className="text-zinc-600" />
        </div>

        <div className="h-[200px] w-full" style={{ minWidth: 0 }}>
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
        </div>
      </div>
    </div>
  )
}
