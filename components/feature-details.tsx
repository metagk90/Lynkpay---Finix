"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const features = [
  {
    icon: ShoppingBag, label: "Digital Product", tagline: "Sell what you know",
    description: "Turn your expertise into income. Sell e-books, templates, presets, design assets, audio packs, and any downloadable file directly from your lynkpay.co page.",
    highlights: ["Instant delivery after purchase", "Supports PDF, ZIP, images, audio & more", "Set your own pricing or pay-what-you-want"],
    image: "/digital.webp", width: 240, height: 448,
  },
  {
    icon: FileText, label: "Blog", tagline: "Write. Publish. Monetize.",
    description: "Share your thoughts, tutorials, or exclusive insights. Create free posts to grow your audience or gate premium content behind a paywall to earn recurring revenue.",
    highlights: ["Rich text editor with media embeds", "Paywall support for premium series", "Built-in reader engagement analytics"],
    image: "/blog.webp", width: 640, height: 362,
  },
  {
    icon: CalendarCheck, label: "Appointment", tagline: "Get booked, get paid",
    description: "Offer paid 1-on-1 consultations, coaching sessions, or mentorship calls. Your audience books directly from your page and you get paid upfront -- no back-and-forth scheduling.",
    highlights: ["Calendar sync with Google & Outlook", "Automated reminders for both parties", "Custom session durations & pricing tiers"],
    image: "/appointment.webp", width: 410, height: 448,
  },
  {
    icon: GraduationCap, label: "Course", tagline: "Teach and scale",
    description: "Upload structured video courses with modules, lessons, and quizzes. Your students get a polished learning experience and you earn money while you sleep.",
    highlights: ["Multi-module course builder", "Video hosting included", "Student progress tracking dashboard"],
    image: "/course.webp", width: 640, height: 362,
  },
  {
    icon: Radio, label: "Event / Webinar", tagline: "Go live, sell tickets",
    description: "Host live workshops, webinars, Q&A sessions, or community meetups. Sell tickets, manage RSVPs, and engage with your audience in real-time.",
    highlights: ["Integrated ticketing & payments", "Live chat and Q&A tools", "Automatic event reminders"],
    image: "/event.webp", width: 640, height: 362,
  },
  {
    icon: Heart, label: "Donation", tagline: "Let fans support you",
    description: "Accept tips, donations, and support from your community. Whether it is a one-time gift or recurring backing, let your fans show appreciation for the value you create.",
    highlights: ["Custom tip amounts or preset tiers", "Supporter messages & shoutouts", "No platform fees on donations"],
    image: "/support.webp", width: 240, height: 448,
  },
  {
    icon: Store, label: "Store", tagline: "Your own mini storefront",
    description: "Set up a lightweight storefront for physical or digital merchandise. From branded merch to exclusive bundles, give your audience a seamless shopping experience.",
    highlights: ["Product catalog with variants & stock", "Secure checkout flow", "Order management dashboard"],
    image: "/section_4.webp", width: 863, height: 644,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const fadeInImage = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
}

export function FeatureDetails() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabsRailRef = useRef<HTMLDivElement>(null)
  const hasCenteredOnLoadRef = useRef(false)
  const activeFeature = features[activeIndex]
  const isPortrait = activeFeature.height > activeFeature.width

  const onTabClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  const goToPrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  const goToNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % features.length)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPrev()
      if (event.key === "ArrowRight") goToNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex]
    const rail = tabsRailRef.current
    if (!activeTab || !rail) return

    const targetLeft = activeTab.offsetLeft - rail.clientWidth / 2 + activeTab.clientWidth / 2
    const maxScroll = rail.scrollWidth - rail.clientWidth
    const clampedLeft = Math.max(0, Math.min(maxScroll, targetLeft))

    rail.scrollTo({
      left: clampedLeft,
      behavior: hasCenteredOnLoadRef.current ? "smooth" : "auto",
    })

    if (!hasCenteredOnLoadRef.current) {
      hasCenteredOnLoadRef.current = true
    }
  }, [activeIndex])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Deep Dive
          </motion.span>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need,{" "}
            <span className="text-primary">built in</span>
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-3 text-pretty text-muted-foreground">
            Each feature is designed to help you earn more and do less. No plugins, no third-party tools, no headaches.
          </motion.p>
        </div>

        <div className="mt-10 flex items-center gap-2">
          <button onClick={goToPrev} className="hidden shrink-0 items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground sm:flex" aria-label="Previous feature">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={tabsRailRef} className="relative no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-smooth" role="tablist">
            {features.map((feature, index) => (
              <button
                key={feature.label}
                role="tab"
                aria-selected={index === activeIndex}
                ref={(node) => { tabRefs.current[index] = node }}
                onClick={() => onTabClick(index)}
                className={`inline-flex min-h-10 shrink-0 snap-center items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition-all sm:rounded-xl ${
                  index === activeIndex
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <feature.icon className="h-4 w-4" />
                {feature.label}
              </button>
            ))}
          </div>
          <button onClick={goToNext} className="hidden shrink-0 items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground sm:flex" aria-label="Next feature">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 sm:hidden">
          <button onClick={goToPrev} className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground" aria-label="Previous feature">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground">
            {activeIndex + 1} / {features.length}
          </span>
          <button onClick={goToNext} className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground" aria-label="Next feature">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
            >
              <div className="flex flex-col gap-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <activeFeature.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-sm font-medium text-primary">{activeFeature.label}</span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-foreground sm:text-3xl">{activeFeature.tagline}</h3>
                </div>
                <p className="leading-relaxed text-muted-foreground">{activeFeature.description}</p>
                <ul className="flex flex-col gap-2.5">
                  {activeFeature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <button className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                  Learn more about {activeFeature.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className={`flex items-center justify-center rounded-2xl border border-border/20 bg-card/40 p-6 ${isPortrait ? "min-h-[400px]" : "min-h-[300px]"}`}>
                <div className="relative w-full" style={{ maxWidth: isPortrait ? 200 : "100%", aspectRatio: `${activeFeature.width}/${activeFeature.height}` }}>
                  <Image src={activeFeature.image} alt={activeFeature.label} fill className="rounded-xl object-contain" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
