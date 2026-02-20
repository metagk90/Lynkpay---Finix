"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, Zap, ShieldCheck } from "lucide-react"

const stats = [
  { icon: Users, value: "50,000+", label: "Active Creators" },
  { icon: Zap, value: "1M+", label: "Links Clicked" },
  { icon: ShieldCheck, value: "99.9%", label: "Uptime" },
]

export function SignupCta() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-primary/5" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Start for free, upgrade anytime
            </span>

            <h2 className="mx-auto max-w-lg text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to{" "}
              <span className="text-primary">monetize</span>{" "}
              your knowledge?
            </h2>

            <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
              Join thousands of creators who are already earning with lynkpay.co.
              Set up your page in minutes -- no coding required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30">
                Sign Up Now!
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
                View Pricing
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Free plan includes all core features.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
