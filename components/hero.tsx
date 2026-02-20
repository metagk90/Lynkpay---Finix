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
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      style={{ y: lift, rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
      className="relative flex items-center justify-center py-6"
    >
      <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ scale: [0.95, 1.08, 0.95] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      </motion.div>

      <motion.div className="relative z-10" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="relative mx-auto h-[520px] w-[260px] overflow-hidden rounded-[2rem] border-2 border-border bg-card shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between bg-card px-5 pb-1 pt-3">
            <span className="text-[10px] text-muted-foreground">9:41</span>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col items-center px-5 pb-4 pt-4">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <span className="font-heading text-2xl font-bold text-primary">JD</span>
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">John Creator</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Content Creator & Coach</p>
            <div className="mt-2 rounded-full bg-primary/10 px-3 py-1">
              <span className="text-xs font-medium text-primary">lynkpay.co/johncreator</span>
            </div>
            <div className="mt-3 rounded-xl border border-primary/25 bg-primary/10 px-3 py-1.5 text-center">
              <p className="text-[10px] text-muted-foreground">Today Revenue</p>
              <p className="font-heading text-sm font-bold text-primary">{animatedRevenue}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4">
            {[
              { Icon: Video, title: "1-on-1 Video Call", sub: "30 min - $50" },
              { Icon: ShoppingBag, title: "E-Book Bundle", sub: "PDF - $29" },
              { Icon: Calendar, title: "Workshop: Growth", sub: "Live Event - $99" },
              { Icon: MessageCircle, title: "Priority Chat", sub: "Monthly - $15" },
            ].map((card) => (
              <div key={card.title} className="flex items-center gap-2.5 rounded-xl bg-secondary p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <card.Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{card.title}</p>
                  <p className="text-[10px] text-muted-foreground">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.9, ease: "easeOut" },
          x: { duration: 0.6, delay: 0.9, ease: "easeOut" },
          y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
        }}
        className="absolute left-[-60px] top-1/8 z-20 rounded-xl border border-border bg-card p-3 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Play className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">New Booking</p>
            <p className="text-[10px] text-primary">+$50.00</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.1, ease: "easeOut" },
          x: { duration: 0.6, delay: 1.1, ease: "easeOut" },
          y: { duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
        }}
        className="absolute -right-4 bottom-1/3 z-20 rounded-xl border border-border bg-card p-3 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 rounded-full bg-primary" />
          <p className="text-xs font-medium text-foreground">142 link clicks today</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MobileAnimatedContainer() {
  const animatedRevenue = useAnimatedRevenue(1240)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.7, delay: 0.25, ease: "easeOut" },
        y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className="relative mx-auto w-full max-w-[390px] px-1 sm:max-w-[430px] sm:px-0"
    >
      <motion.div
        className="pointer-events-none absolute -inset-4 rounded-[30px] border border-primary/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-7 rounded-[36px] border border-dashed border-primary/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[90px]"
        animate={{ scale: [0.92, 1.05, 0.92], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="relative overflow-hidden rounded-[30px] border border-border/80 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm" animate={{ scale: [1, 1.012, 1] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">Page Creator</span>
          </div>
          <Image src="/logo.svg" alt="lynkpay.co logo" width={80} height={10} className="h-4 w-auto object-contain" />
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-secondary/40 p-4">
          <p className="text-xs text-muted-foreground">Today Revenue</p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">{animatedRevenue}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: ["28%", "74%", "52%", "88%", "65%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {["Chat", "Booking", "Products", "Events"].map((item) => (
            <div key={item} className="rounded-xl border border-border/60 bg-card px-3 py-2 text-center text-xs font-medium text-foreground">
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute -left-1 top-6 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-left-8 sm:-top-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          New subscriber
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-1 bottom-8 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-right-2 sm:bottom-10"
        animate={{ y: [0, 11, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-[11px] font-medium text-primary">+12 orders</div>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)

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
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-background pt-20 sm:pt-24 lg:pt-28"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {!reduceMotion ? <motion.div className="pointer-events-none absolute inset-0" style={{ backgroundImage: glow, y: parallaxY }} /> : null}

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 md:py-16 lg:flex-row lg:gap-14 lg:px-8 lg:py-20">
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 sm:mb-6 sm:px-4"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium text-primary sm:text-xs">Creator Economy Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Powering <span className="text-primary">Creators</span> Economy
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg"
          >
            Create Instant Mobile Webpage to sell your knowledge. Chat, Video Calls, Events, Digital Product. Share it across social media.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-5 flex max-w-full items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 sm:mt-6 sm:px-4 sm:py-2.5"
          >
            <Image src="/logo.svg" alt="lynkpay.co logo" width={120} height={20} className="h-5 w-auto object-contain" />
            <span className="text-xs text-muted-foreground sm:text-sm">lynkpay.co/</span>
            <span className="max-w-[105px] truncate text-xs font-medium text-primary sm:max-w-none sm:text-sm">yourname</span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row"
          >
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 sm:w-auto sm:py-3.5"
              >
                SIGN UP FREE
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
              <Link
                href="#demo"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto sm:py-3.5"
              >
                <Play className="h-4 w-4 text-primary" />
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3 lg:justify-start"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.label}
                whileHover={{ y: -2 }}
                className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2"
              >
                <feature.icon className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
                <span className="text-[11px] text-muted-foreground sm:text-xs">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
            className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">10k+</span> active creators
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">3.1x</span> avg growth
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Secure</span> payments
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={7}
            className="mt-5 w-full max-w-xl overflow-hidden rounded-xl border border-primary/20 bg-primary/5"
          >
            <motion.div
              className="flex w-max items-center gap-4 px-3 py-2.5 sm:gap-6 sm:px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-2 whitespace-nowrap text-[11px] text-primary sm:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-6 pt-1 sm:gap-8 sm:pt-3 lg:flex-row lg:gap-8 lg:pt-0">
          <MobileAnimatedContainer />
          <DesktopDeviceMockup lift={deviceLift} tiltX={tiltX} tiltY={tiltY} />

          <motion.div
            className="absolute -right-1 top-4 hidden rounded-xl border border-border/80 bg-card/90 px-3 py-2 shadow-lg backdrop-blur lg:block"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-[11px] text-muted-foreground">Live Sales</p>
            <p className="text-sm font-semibold text-primary">+26% this week</p>
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-1 hidden rounded-xl border border-border/80 bg-card/90 px-3 py-2 shadow-lg backdrop-blur lg:block"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-[11px] text-muted-foreground">Bookings</p>
            <p className="text-sm font-semibold text-foreground">18 confirmed today</p>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent sm:h-32" />
    </section>
  )
}