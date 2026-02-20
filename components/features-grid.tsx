"use client"

import { motion } from "framer-motion"
import {
  ShoppingBag,
  FileText,
  CalendarCheck,
  GraduationCap,
  Radio,
  Heart,
  Store,
  ArrowRight,
} from "lucide-react"

const offerings = [
  { icon: ShoppingBag, label: "Digital Product", description: "Sell e-books, templates, presets, and any downloadable content.", color: "from-primary/20 to-primary/5" },
  { icon: FileText, label: "Blog", description: "Publish and monetize your articles with built-in reader engagement.", color: "from-primary/20 to-primary/5" },
  { icon: CalendarCheck, label: "Appointment", description: "Let your audience book 1-on-1 consultations and coaching sessions.", color: "from-primary/20 to-primary/5" },
  { icon: GraduationCap, label: "Course", description: "Build and sell structured courses with modules and progress tracking.", color: "from-primary/20 to-primary/5" },
  { icon: Radio, label: "Event / Webinar", description: "Host live events and webinars with integrated ticketing.", color: "from-primary/20 to-primary/5" },
  { icon: Heart, label: "Donation", description: "Accept tips and donations from fans who love your work.", color: "from-primary/20 to-primary/5" },
  { icon: Store, label: "Store", description: "Set up a full storefront for physical or digital merchandise.", color: "from-primary/20 to-primary/5" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
}

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            All-in-One Platform
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Not just another{" "}
            <span className="text-primary">link-in-bio</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-3 text-pretty text-muted-foreground">
            lynkpay.co takes care of your entire workflow, start to finish. Everything you need to monetize your audience in one place.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((item, i) => (
            <motion.div key={item.label} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/60 p-6 transition-colors hover:border-primary/20 hover:bg-card">
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}>
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="h-3 w-3" />
              </div>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
