"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, MessageCircle, Video, Calendar, ShoppingBag, Sparkles, CheckCircle2, ShieldCheck, TrendingUp, Users } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const features = [
  { icon: MessageCircle, label: "Chat" },
  { icon: Video, label: "Video Calls" },
  { icon: Calendar, label: "Events" },
  { icon: ShoppingBag, label: "Digital Product" },
]

const tickerItems = [
  "128 bookings this week",
  "$24,190 creator payouts",
  "1,042 products sold",
  "99.9% checkout uptime",
  "8.4% avg conversion uplift",
]

function useAnimatedRevenue(target: number = 1240) {
  const value = useMotionValue(1)
  const rounded = useTransform(value, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(1)

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplay(latest)
  })

  useEffect(() => {
    const controls = animate(value, target, {
      duration: 3.2,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: 0.9,
      repeatType: "loop",
    })
    return () => controls.stop()
  }, [target, value])

  return `$${display.toLocaleString()}`
}

function DesktopDeviceMockup({
  lift,
  tiltX,
  tiltY,
}: {
  lift: MotionValue<number>
  tiltX: MotionValue<number>
  tiltY: MotionValue<number>
}) {
  const animatedRevenue = useAnimatedRevenue(1240)

  return (
    <motion.div style={{ y: lift, rotateX: tiltX, rotateY: tiltY }} className="relative hidden w-[280px] shrink-0 lg:block" aria-hidden>
      <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl shadow-primary/10">
        <div className="relative p-4">
          <div className="absolute inset-x-0 top-0 flex h-8 items-center justify-center">
            <span className="text-[10px] text-muted-foreground">9:41</span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
              JD
            </div>
            <p className="text-sm font-semibold text-foreground">John Creator</p>
            <p className="text-[11px] text-muted-foreground">Content Creator & Coach</p>
            <p className="mt-0.5 text-[10px] text-primary">lynkpay.co/johncreator</p>
            <div className="mt-3 w-full rounded-xl border border-border/40 bg-secondary/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Today Revenue</p>
              <p className="text-lg font-bold text-primary">{animatedRevenue}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {[
              { Icon: Video, title: "1-on-1 Video Call", sub: "30 min - $50" },
              { Icon: ShoppingBag, title: "E-Book Bundle", sub: "PDF - $29" },
              { Icon: Calendar, title: "Workshop: Growth", sub: "Live Event - $99" },
              { Icon: MessageCircle, title: "Priority Chat", sub: "Monthly - $15" },
            ].map((card) => (
              <div key={card.title} className="flex items-center gap-3 rounded-xl border border-border/30 bg-secondary/30 p-2.5 transition-colors hover:bg-secondary/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <card.Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{card.title}</p>
                  <p className="text-[10px] text-muted-foreground">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }} className="absolute -right-4 top-24 rounded-xl border border-border/50 bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <p className="text-[11px] font-medium text-foreground">New Booking</p>
          <span className="text-[11px] font-semibold text-primary">+$50.00</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.5 }} className="absolute -left-2 bottom-20 rounded-lg border border-border/50 bg-card px-3 py-2 shadow-lg">
        <p className="text-[10px] text-muted-foreground">142 link clicks today</p>
      </motion.div>
    </motion.div>
  )
}

function MobileAnimatedContainer() {
  const animatedRevenue = useAnimatedRevenue(1240)

  return (
    <div className="mt-10 flex justify-center lg:hidden" aria-hidden>
      <div className="w-[260px] overflow-hidden rounded-[1.5rem] border border-border/60 bg-card p-4 shadow-xl">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            PC
          </div>
          <p className="text-sm font-semibold text-foreground">Page Creator</p>
          <div className="mt-2 w-full rounded-lg bg-secondary/50 p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground">Today Revenue</p>
            <p className="text-lg font-bold text-primary">{animatedRevenue}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {["Chat", "Booking", "Products", "Events"].map((item) => (
            <span key={item} className="rounded-full border border-border/40 bg-secondary/30 px-2.5 py-1 text-[10px] text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 p-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <p className="text-[10px] text-foreground">New subscriber</p>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-primary">+12 orders</span>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const pointerX = useMotionValue(50)
  const pointerY = useMotionValue(50)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const parallaxY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    stiffness: 90,
    damping: 22,
  })
  const deviceLift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -42]), {
    stiffness: 100,
    damping: 24,
  })
  const tiltX = useSpring(useTransform(pointerY, [0, 100], [8, -8]), {
    stiffness: 120,
    damping: 22,
  })
  const tiltY = useSpring(useTransform(pointerX, [0, 100], [-9, 9]), {
    stiffness: 120,
    damping: 22,
  })
  const glow = useMotionTemplate`radial-gradient(420px circle at ${pointerX}% ${pointerY}%, rgba(16,185,129,0.24), transparent 62%)`

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    pointerX.set(Math.max(0, Math.min(100, x)))
    pointerY.set(Math.max(0, Math.min(100, y)))
  }

  const handlePointerLeave = () => {
    pointerX.set(50)
    pointerY.set(50)
  }

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
      <motion.div style={{ background: glow }} className="pointer-events-none absolute inset-0 -z-10" />
      {!reduceMotion ? <motion.div style={{ y: parallaxY }} className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(160_84%_39%/0.18),transparent_62%)]" /> : null}

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl text-center lg:text-left">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Creator Economy Platform
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Powering Creators Economy
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Create Instant Mobile Webpage to sell your knowledge. Chat, Video Calls, Events, Digital Product. Share it across social media.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 flex items-center justify-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm text-muted-foreground lg:inline-flex lg:justify-start">
            <span>lynkpay.co/</span>
            <span className="font-semibold text-primary">yourname</span>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30">
              SIGN UP FREE
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button className="group inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
              <Play className="h-4 w-4" />
              See How It Works
            </button>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {features.map((feature) => (
              <span key={feature.label} className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
                <feature.icon className="h-3.5 w-3.5 text-primary" />
                {feature.label}
              </span>
            ))}
          </motion.div>

          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              10k+ active creators
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              3.1x avg growth
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Secure payments
            </span>
          </motion.div>

          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] gap-6">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span key={index} className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground/60">
                  <CheckCircle2 className="h-3 w-3 text-primary/50" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <DesktopDeviceMockup lift={deviceLift} tiltX={tiltX} tiltY={tiltY} />

        <MobileAnimatedContainer />
      </div>

      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="mx-auto mt-12 flex max-w-lg justify-center gap-6">
        <div className="rounded-xl border border-border/30 bg-card/60 px-5 py-3 text-center">
          <p className="text-xs text-muted-foreground">Live Sales</p>
          <p className="text-sm font-semibold text-primary">+26% this week</p>
        </div>
        <div className="rounded-xl border border-border/30 bg-card/60 px-5 py-3 text-center">
          <p className="text-xs text-muted-foreground">Bookings</p>
          <p className="text-sm font-semibold text-primary">18 confirmed today</p>
        </div>
      </motion.div>
    </section>
  )
}
