"use client"

import { motion } from "framer-motion"
import { Globe, BarChart3, Megaphone, ArrowRight } from "lucide-react"

const benefits = [
  { icon: Globe, title: "Create Your Own Custom Domain", description: "Use your own branded domain to strengthen your identity. Integrate with Instagram Shopping and sell seamlessly across social platforms.", cta: "Set up your domain" },
  { icon: BarChart3, title: "Get Real Insights", description: "Track page views, product sales, click-through rates, and audience behavior with built-in analytics. Make data-driven decisions to grow faster.", cta: "View analytics demo" },
  { icon: Megaphone, title: "Optimizing Digital Marketing", description: "Connect with your favorite marketing channels -- Facebook Pixel, Google Analytics, TikTok Pixel, and more. Retarget visitors and boost conversions.", cta: "Explore integrations" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" },
  }),
}

export function ProductBenefits() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Grow Smarter
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tools to supercharge your growth
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-3 text-pretty text-muted-foreground">
            Go beyond link-in-bio. Get the infrastructure to run a real creator business.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, i) => (
            <motion.div key={benefit.title} variants={fadeUp} custom={i + 3} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/60 p-6 transition-colors hover:border-primary/20 hover:bg-card">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                {benefit.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
