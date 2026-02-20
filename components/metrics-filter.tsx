"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const presets = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7", label: "Last 7 days" },
  { value: "last_30", label: "Last 30 days" },
  { value: "mtd", label: "Month to date" },
  { value: "ytd", label: "Year to date" },
]

export function MetricsFilter() {
  const [preset, setPreset] = useState("last_30")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const hasCustomRange = dateRange?.from != null

  function clearCustomRange() {
    setDateRange(undefined)
  }

  function formatRange(range: DateRange) {
    if (range.from && range.to) {
      return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`
    }
    if (range.from) {
      return format(range.from, "MMM d, yyyy")
    }
    return "Pick a date"
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        Showing data for
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Preset dropdown */}
        <Select value={hasCustomRange ? "" : preset} onValueChange={(v) => { setPreset(v); clearCustomRange() }}>
          <SelectTrigger
            className="h-9 w-auto min-w-[150px] gap-2 rounded-xl border-zinc-800 bg-zinc-900/60 text-sm font-bold text-zinc-300 hover:border-zinc-700 focus:ring-emerald-500/30 transition-all data-[placeholder]:text-zinc-500"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-800 bg-zinc-900 shadow-2xl">
            {presets.map((p) => (
              <SelectItem
                key={p.value}
                value={p.value}
                className="rounded-lg text-sm font-semibold text-zinc-300 focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer"
              >
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom date range picker */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={`inline-flex items-center gap-2 h-9 px-3 rounded-xl border text-sm font-bold transition-all ${
                hasCustomRange
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <CalendarIcon size={14} />
              {hasCustomRange ? formatRange(dateRange!) : "Custom range"}
              <ChevronDown size={12} className="opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 rounded-2xl border-zinc-800 bg-zinc-900 shadow-2xl"
            align="start"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                  Select date range
                </span>
                {hasCustomRange && (
                  <button
                    onClick={() => { clearCustomRange(); setCalendarOpen(false) }}
                    className="text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    setCalendarOpen(false)
                  }
                }}
                numberOfMonths={2}
                className="rounded-xl"
                classNames={{
                  day_selected: "bg-emerald-500 text-black hover:bg-emerald-400",
                  day_range_middle: "bg-emerald-500/15 text-emerald-300",
                  day_range_end: "bg-emerald-500 text-black",
                  day_today: "bg-zinc-800 text-white",
                }}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear custom range tag */}
        {hasCustomRange && (
          <button
            onClick={clearCustomRange}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-zinc-800 text-[11px] font-bold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X size={10} /> Clear dates
          </button>
        )}
      </div>
    </div>
  )
}
