"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Video, Heart, Link2, HelpCircle, UserCircle, ArrowRight } from "lucide-react"

const useCases = [
  { icon: ShoppingBag, title: "Digital Products", description: "Package your knowledge into downloadable products -- e-books, templates, presets, checklists. Upload once, sell forever. Your audience buys directly from your page with instant delivery.", tag: "Sell" },
  { icon: Video, title: "Virtual Class", description: "Host live or recorded classes for your community. Set pricing, limit seats, and deliver premium educational content. Students get a polished experience with progress tracking built in.", tag: "Teach" },
  { icon: Heart, title: "Donations", description: "Give your fans a simple way to say thank you. Accept one-time tips or recurring support with custom amounts. Supporters can leave messages and get featured on your page.", tag: "Earn" },
  { icon: Link2, title: "Consolidate Links", description: "Bring your entire online presence into one beautiful page. Social profiles, websites, portfolios, shops -- everything organized and accessible from a single shareable link.", tag: "Organize" },
  { icon: HelpCircle, title: "Answering Questions", description: "Monetize your expertise with paid Q&A sessions. Your audience submits questions, you reply on your schedule. Great for coaches, consultants, and subject-matter experts.", tag: "Consult" },
  { icon: UserCircle, title: "Customize (Meet 1:1)", description: "Offer personalized 1-on-1 video calls for mentoring, coaching, or consultations. Set your availability, define session lengths, and let clients book and pay upfront.", tag: "Connect" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
}

export function UseCases() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Use Cases
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How creators use{" "}
            <span className="text-primary">lynkpay.co</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-3 text-pretty text-muted-foreground">
            From selling digital products to booking 1-on-1 calls, see how creators are building their businesses.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {useCases.map((uc, i) => (
            <motion.div key={uc.title} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/60 transition-colors hover:border-primary/20 hover:bg-card">
              <div className="flex items-center justify-between border-b border-border/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <uc.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{uc.title}</h3>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">{uc.tag}</span>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{uc.description}</p>
                <button className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
            Start building your page
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
