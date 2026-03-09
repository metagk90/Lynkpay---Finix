"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  ShoppingBag,
  FileText,
  CalendarCheck,
  GraduationCap,
  Radio,
  Heart,
  Store,
  ArrowRight,
  Pause,
  Play,
  type LucideIcon,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Feature {
  icon: LucideIcon
  label: string
  tagline: string
  description: string
  bullets: string[]
  image: string
}

const features: Feature[] = [
  {
    icon: ShoppingBag,
    label: "Digital Products",
    tagline: "Sell anything digital",
    description:
      "Package your expertise into e-books, templates, presets, design assets, or any downloadable content. Set your price, upload your file, and start earning instantly.",
    bullets: [
      "Instant delivery after purchase",
      "Secure file hosting included",
      "Flexible pricing & bundles",
    ],
    image: "/digital.webp",
  },
  {
    icon: FileText,
    label: "Blog",
    tagline: "Write, publish, monetize",
    description:
      "Create rich articles with a built-in editor. Grow your audience with SEO-ready posts and convert readers into paying subscribers.",
    bullets: [
      "Rich-text & media embeds",
      "Built-in reader analytics",
      "Paywalled premium content",
    ],
    image: "/blog.webp",
  },
  {
    icon: CalendarCheck,
    label: "Appointments",
    tagline: "Book 1-on-1 sessions",
    description:
      "Let fans and clients book consultations, coaching calls, or mentorship sessions directly from your page. Syncs with your calendar automatically.",
    bullets: [
      "Calendar sync (Google, Outlook)",
      "Automated reminders",
      "Custom availability windows",
    ],
    image: "/appointment.webp",
  },
  {
    icon: GraduationCap,
    label: "Courses",
    tagline: "Teach and earn",
    description:
      "Build structured courses with video lessons, quizzes, and progress tracking. Give your students a premium learning experience.",
    bullets: [
      "Module & lesson organizer",
      "Student progress tracking",
      "Drip-release scheduling",
    ],
    image: "/course.webp",
  },
  {
    icon: Radio,
    label: "Events & Webinars",
    tagline: "Go live, get paid",
    description:
      "Host ticketed live events, workshops, and webinars with integrated registration and real-time attendee management.",
    bullets: [
      "Integrated ticket sales",
      "Live chat & Q&A",
      "Recording & replay access",
    ],
    image: "/event.webp",
  },
  {
    icon: Heart,
    label: "Donations",
    tagline: "Let fans support you",
    description:
      "Accept tips, donations, and recurring support from your community. Give fans an easy way to say thanks.",
    bullets: [
      "Custom tip amounts",
      "Supporter wall & shout-outs",
      "Recurring support tiers",
    ],
    image: "/support.webp",
  },
  {
    icon: Store,
    label: "Store",
    tagline: "Your own storefront",
    description:
      "Set up a full e-commerce store for physical or digital merchandise. Manage inventory, orders, and shipping from one dashboard.",
    bullets: [
      "Product catalog & variants",
      "Order & inventory management",
      "Discount codes & promotions",
    ],
    image: "/section_4.webp",
  },
]

/* ------------------------------------------------------------------ */
/*  Auto-cycle interval (ms)                                           */
/* ------------------------------------------------------------------ */
const INTERVAL = 5000

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FeaturesGrid() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tabBarRef = useRef<HTMLDivElement>(null)

  /* ---------- auto-cycle logic ---------- */
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  const startCycle = useCallback(() => {
    clearTimers()
    setProgress(0)

    const progressStep = 50 // ms between progress ticks
    const steps = INTERVAL / progressStep

    let tick = 0
    progressRef.current = setInterval(() => {
      tick++
      setProgress(Math.min((tick / steps) * 100, 100))
    }, progressStep)

    timerRef.current = setInterval(() => {
      setDirection(1)
      setActiveIdx((prev) => (prev + 1) % features.length)
      tick = 0
      setProgress(0)
    }, INTERVAL)
  }, [clearTimers])

  useEffect(() => {
    if (isPlaying) startCycle()
    else clearTimers()
    return clearTimers
  }, [isPlaying, startCycle, clearTimers])

  /* restart cycle whenever activeIdx changes (including manual clicks) */
  useEffect(() => {
    if (isPlaying) startCycle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

  /* horizontally scroll tab bar so the active tab is centred (no page scroll) */
  useEffect(() => {
    const container = tabBarRef.current
    if (!container) return
    const activeBtn = container.children[activeIdx] as HTMLElement | undefined
    if (!activeBtn) return

    const scrollLeft =
      activeBtn.offsetLeft -
      container.offsetWidth / 2 +
      activeBtn.offsetWidth / 2

    container.scrollTo({ left: scrollLeft, behavior: "smooth" })
  }, [activeIdx])

  const handleTabClick = (idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1)
    setActiveIdx(idx)
    setProgress(0)
  }

  const active = features[activeIdx]

  /* ---------- animation variants ---------- */
  const panelVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
  }

  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      {/* top divider */}
      <div className="absolute inset-x-0 top-0 h-px section-divider" />

      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- heading ---- */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary"
          >
            All-in-One Platform
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Everything you need,{" "}
            <span className="text-primary">built&nbsp;in</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-pretty leading-relaxed text-muted-foreground sm:text-lg"
          >
            Seven powerful tools, one seamless platform. Click a tab to explore
            what you can build.
          </motion.p>
        </div>

        {/* ---- tab bar ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mt-12"
        >
          {/* play / pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause auto-cycle" : "Play auto-cycle"}
            className="absolute -top-1 right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-primary sm:right-2"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          {/* scrollable tabs */}
          <div
            ref={tabBarRef}
            className="relative no-scrollbar flex gap-1.5 overflow-x-auto pb-2 sm:justify-center"
          >
            {features.map((f, i) => {
              const isActive = i === activeIdx
              const Icon = f.icon
              return (
                <button
                  key={f.label}
                  onClick={() => handleTabClick(i)}
                  className={`
                    group relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5
                    text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                        : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className="hidden whitespace-nowrap sm:inline">{f.label}</span>

                  {/* progress underline */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 overflow-hidden rounded-full bg-primary/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </motion.div>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ---- content panel ---- */}
        <div className="relative mt-10 min-h-[420px] sm:min-h-[480px] lg:min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* text side */}
              <div className="order-2 lg:order-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                  <active.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {active.label}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {active.tagline}
                </p>

                <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                  {active.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {active.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-primary">
                          <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <button className="mt-8 group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-110">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* image side */}
              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/40 shadow-2xl shadow-primary/5">
                  <Image
                    src={active.image}
                    alt={`${active.label} feature preview`}
                    width={640}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                  {/* subtle overlay gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---- mobile dot indicators ---- */}
        <div className="mt-8 flex justify-center gap-1.5 sm:hidden">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              aria-label={`Go to ${features[i].label}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
