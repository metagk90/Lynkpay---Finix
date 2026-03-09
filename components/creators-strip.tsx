"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Heart,
  MessageCircle,
  Grid3X3,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Users,
  TrendingUp,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Creator data                                                       */
/* ------------------------------------------------------------------ */
const creators = [
  {
    name: "Sarah Wellness",
    handle: "@sarahwellness",
    avatar: "/user-1.webp",
    followers: "245K",
    following: "1,204",
    posts: "834",
    bio: "Wellness coach & yoga instructor. Helping you live your best life through mindful movement.",
    category: "Wellness",
    earnings: "$12.4K/mo",
    verified: true,
    postImages: ["/creators/post-1a.jpg", "/creators/post-1b.jpg", "/creators/post-1c.jpg"],
    postLikes: ["12.4K", "8.7K", "15.2K"],
    postComments: ["342", "198", "421"],
  },
  {
    name: "Mike Fitness",
    handle: "@mikefitpro",
    avatar: "/user-2.webp",
    followers: "189K",
    following: "876",
    posts: "1,247",
    bio: "Certified PT & nutrition specialist. Transform your body, elevate your mindset.",
    category: "Fitness",
    earnings: "$9.8K/mo",
    verified: true,
    postImages: ["/creators/post-2a.jpg", "/creators/post-2b.jpg", "/creators/post-2c.jpg"],
    postLikes: ["9.8K", "6.3K", "22.1K"],
    postComments: ["267", "154", "589"],
  },
  {
    name: "Ava Styles",
    handle: "@avastyles",
    avatar: "/user-3.webp",
    followers: "312K",
    following: "543",
    posts: "2,156",
    bio: "Fashion & beauty curator. Your daily dose of editorial style inspiration.",
    category: "Fashion",
    earnings: "$18.2K/mo",
    verified: true,
    postImages: ["/creators/post-3a.jpg", "/creators/post-3b.jpg", "/creators/post-3c.jpg"],
    postLikes: ["18.9K", "14.2K", "11.7K"],
    postComments: ["523", "387", "298"],
  },
  {
    name: "Dev Patel",
    handle: "@devteaches",
    avatar: "/user-4.webp",
    followers: "156K",
    following: "1,892",
    posts: "654",
    bio: "Full-stack dev & educator. Making coding accessible and practical for everyone.",
    category: "Tech",
    earnings: "$7.6K/mo",
    verified: true,
    postImages: ["/creators/post-4a.jpg", "/creators/post-4b.jpg", "/creators/post-4c.jpg"],
    postLikes: ["7.6K", "5.1K", "13.4K"],
    postComments: ["189", "134", "312"],
  },
  {
    name: "Luna Creative",
    handle: "@lunabeats",
    avatar: "/user-5.webp",
    followers: "278K",
    following: "2,341",
    posts: "1,892",
    bio: "Digital artist & music producer. Creating immersive worlds through art and sound.",
    category: "Art",
    earnings: "$15.7K/mo",
    verified: true,
    postImages: ["/creators/post-5a.jpg", "/creators/post-5b.jpg", "/creators/post-5c.jpg"],
    postLikes: ["21.3K", "16.7K", "19.8K"],
    postComments: ["612", "445", "534"],
  },
  {
    name: "James Coach",
    handle: "@jamescoach",
    avatar: "/user-6.webp",
    followers: "421K",
    following: "312",
    posts: "978",
    bio: "Business strategist & keynote speaker. Helping founders scale their vision to reality.",
    category: "Business",
    earnings: "$32.1K/mo",
    verified: true,
    postImages: ["/creators/post-6a.jpg", "/creators/post-6b.jpg", "/creators/post-6c.jpg"],
    postLikes: ["32.1K", "25.4K", "28.9K"],
    postComments: ["876", "654", "745"],
  },
]

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/* ------------------------------------------------------------------ */
/*  Verified badge                                                     */
/* ------------------------------------------------------------------ */
function VerifiedBadge() {
  return (
    <svg className="ml-1 inline-block h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-label="Verified">
      <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" />
      <path d="M8 12l2.5 2.5L16 9" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Creator card                                                       */
/* ------------------------------------------------------------------ */
function CreatorCard({ creator }: { creator: (typeof creators)[0] }) {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <div className="group w-full select-none">
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/25 hover:shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.15)]">
        {/* Profile header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-[2.5px] ring-primary/30 ring-offset-2 ring-offset-card">
            <Image src={creator.avatar} alt={creator.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <p className="truncate text-sm font-bold text-foreground">{creator.name}</p>
              {creator.verified && <VerifiedBadge />}
            </div>
            <p className="text-xs text-muted-foreground">{creator.handle}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="inline-block rounded-full bg-primary/10 px-2 py-[1px] text-[10px] font-semibold text-primary">
                {creator.category}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-[1px] text-[10px] font-semibold text-emerald-400">
                <TrendingUp className="h-2.5 w-2.5" />
                {creator.earnings}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-around border-y border-border/30 px-4 py-2.5">
          {[
            { value: creator.posts, label: "Posts" },
            { value: creator.followers, label: "Followers" },
            { value: creator.following, label: "Following" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-0">
              {i > 0 && <div className="mr-3 h-6 w-px bg-border/30" />}
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="px-4 py-2.5">
          <p className="text-xs leading-relaxed text-muted-foreground">{creator.bio}</p>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-3 gap-[2px] px-[2px] pb-[2px]">
          {creator.postImages.map((img, i) => (
            <div
              key={img}
              className="relative aspect-square overflow-hidden"
              onMouseEnter={() => setHoveredPost(i)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <Image
                src={img}
                alt={`${creator.name} post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="120px"
              />
              <AnimatePresence>
                {hoveredPost === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50"
                  >
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
                      <Heart className="h-3.5 w-3.5 fill-white" />
                      {creator.postLikes[i]}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
                      <MessageCircle className="h-3.5 w-3.5 fill-white" />
                      {creator.postComments[i]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center justify-between border-t border-border/30 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Grid3X3 className="h-3.5 w-3.5 text-muted-foreground" />
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <a
            href="#"
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            View Profile
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat pill used in the header area                                  */
/* ------------------------------------------------------------------ */
function StatPill({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/30 bg-card/60 px-3.5 py-1.5 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main exported section                                              */
/* ------------------------------------------------------------------ */
export function CreatorsStrip() {
  const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
      containScroll: false,
    },
    [autoplayPlugin],
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return
    if (autoplay.isPlaying()) {
      autoplay.stop()
      setIsPlaying(false)
    } else {
      autoplay.play()
      setIsPlaying(true)
    }
  }, [emblaApi])

  /* Keep track of current slide */
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    const onAutoplayPlay = () => setIsPlaying(true)
    const onAutoplayStop = () => setIsPlaying(false)
    const autoplay = emblaApi.plugins()?.autoplay
    if (autoplay) {
      autoplay.on?.("play" as never, onAutoplayPlay)
      autoplay.on?.("stop" as never, onAutoplayStop)
    }

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px section-divider" />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />

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
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Trusted by 10,000+ creators worldwide
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            The Best Creators Use{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              lynkpay.co
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-4 text-pretty leading-relaxed text-muted-foreground sm:text-lg"
          >
            From wellness coaches to tech educators, creators across every niche use LynkPay
            to monetize their audience, sell digital products, and build thriving online businesses.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <StatPill icon={Users} value="10K+" label="Creators" />
            <StatPill icon={TrendingUp} value="$2.4M+" label="Earned" />
            <StatPill icon={Heart} value="50M+" label="Fans reached" />
          </motion.div>
        </div>

        {/* Controls row: arrows + autoplay toggle */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <button
            onClick={scrollPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            aria-label="Previous creator"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={toggleAutoplay}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            aria-label={isPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
          </button>

          <button
            onClick={scrollNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            aria-label="Next creator"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Embla carousel */}
        <div className="relative mt-8">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-20" />

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-5">
              {creators.map((creator) => (
                <div
                  key={creator.handle}
                  className="min-w-0 flex-[0_0_280px] sm:flex-[0_0_300px] lg:flex-[0_0_320px]"
                >
                  <CreatorCard creator={creator} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators with progress animation */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {creators.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to creator ${i + 1}`}
              className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === selectedIndex ? 28 : 6 }}
            >
              <span className="absolute inset-0 rounded-full bg-muted-foreground/20" />
              {i === selectedIndex && (
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  key={`progress-${selectedIndex}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
