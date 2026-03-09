"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { InfiniteSlider } from "@/components/infinite-slider"
import {
  Zap,
  ShoppingBag,
  CalendarCheck,
  GraduationCap,
  Users,
  HeartHandshake,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

const slides = [
  {
    title: "Sell Digital Products",
    description:
      "Create and sell e-books, templates, presets, and any digital download. Set your price, upload your file, and start earning in minutes.",
    image: "/digital.webp",
    icon: ShoppingBag,
    stat: "2M+",
    statLabel: "Products sold",
    accentColor: "from-emerald-500 to-teal-400",
    tag: "Most Popular",
  },
  {
    title: "Book Appointments",
    description:
      "Let your audience book 1-on-1 calls, coaching sessions, or consultations. Calendar syncing, reminders, and payments built right in.",
    image: "/appointment.webp",
    icon: CalendarCheck,
    stat: "98%",
    statLabel: "Booking rate",
    accentColor: "from-blue-500 to-cyan-400",
    tag: "High Demand",
  },
  {
    title: "Launch Courses",
    description:
      "Build and sell online courses with structured modules, video hosting, and student progress tracking. Monetize your expertise at scale.",
    image: "/course.webp",
    icon: GraduationCap,
    stat: "500K+",
    statLabel: "Students enrolled",
    accentColor: "from-violet-500 to-purple-400",
    tag: "Scale Up",
  },
  {
    title: "Host Events & Webinars",
    description:
      "Sell tickets to live events, webinars, and virtual meetups. Manage attendees, send reminders, and go live with integrated streaming.",
    image: "/event.webp",
    icon: Users,
    stat: "12K+",
    statLabel: "Events hosted",
    accentColor: "from-orange-500 to-amber-400",
    tag: "Go Live",
  },
  {
    title: "Accept Donations",
    description:
      "Let your supporters tip, donate, or sponsor you with flexible amounts. Build a sustainable income from people who love your content.",
    image: "/support.webp",
    icon: HeartHandshake,
    stat: "$18M+",
    statLabel: "Creator earnings",
    accentColor: "from-pink-500 to-rose-400",
    tag: "Fan-Powered",
  },
]

/* ------------------------------------------------------------------ */
/*  Individual slide renderer                                          */
/* ------------------------------------------------------------------ */

function SlideContent({
  item,
}: {
  item: (typeof slides)[0]
  index: number
}) {
  const Icon = item.icon

  return (
    <div className="relative flex h-full flex-col overflow-hidden md:flex-row">
      {/* Left content panel */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8 md:p-10 lg:p-14">
        {/* Tag pill */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${item.accentColor} px-3 py-1 text-[11px] font-semibold text-white shadow-sm`}
          >
            <Zap className="h-3 w-3" />
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {item.title}
        </h3>

        {/* Description */}
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.description}
        </p>

        {/* Stat badge */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/40 bg-card/80">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p
              className={`bg-gradient-to-r ${item.accentColor} bg-clip-text text-xl font-bold text-transparent`}
            >
              {item.stat}
            </p>
            <p className="text-xs text-muted-foreground">{item.statLabel}</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/signup"
          className="group mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Get started free
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Right image panel */}
      <div className="relative hidden flex-1 md:block">
        {/* Gradient overlay for smooth blend */}
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card/60 to-transparent" />
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 0vw, 50vw"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-card/60 to-transparent" />
      </div>

      {/* Mobile image -- shows as a shorter strip at the bottom */}
      <div className="relative h-44 w-full md:hidden">
        <div className="absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-card/60 to-transparent" />
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function SliderShowcase() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px section-divider" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <Zap className="h-3 w-3" />
            Everything you need
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            One Platform,{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Endless Possibilities
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-4 text-pretty leading-relaxed text-muted-foreground sm:text-lg"
          >
            From digital products to live events, lynkpay.co gives you every
            tool to monetize your skills and grow your community.
          </motion.p>
        </div>

        {/* The slider */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12"
        >
          <InfiniteSlider
            items={slides}
            renderSlide={(item, index) => (
              <SlideContent item={item} index={index} />
            )}
            interval={5000}
            transition="scale"
            heightClass="h-[520px] sm:h-[440px] md:h-[420px]"
            className="border-primary/10 shadow-[0_8px_60px_-15px_hsl(var(--primary)/0.08)]"
          />
        </motion.div>
      </div>
    </section>
  )
}
