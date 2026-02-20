"use client"

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full relative cursor-pointer border transition-colors shrink-0 ${
        value ? "bg-emerald-500/20 border-emerald-500/50" : "bg-zinc-800 border-zinc-700"
      }`}
    >
      <div
        className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${
          value ? "right-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "left-1 bg-zinc-600"
        }`}
      />
    </div>
  )
}
