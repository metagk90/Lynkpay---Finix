"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, MessageCircle, Grid3X3, Bookmark, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

const creators = [
  {
    name: "Sarah Wellness",
    handle: "@sarahwellness",
    avatar: "/user-1.webp",
    followers: "245K",
    following: "1,204",
    posts: "834",
    bio: "Wellness coach & yoga instructor. Helping you live your best life.",
    category: "Wellness",
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
    bio: "Certified PT & nutrition specialist. Transform your body.",
    category: "Fitness",
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
    bio: "Fashion & beauty. Your daily dose of style inspiration.",
    category: "Fashion",
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
    bio: "Full-stack dev & educator. Making coding accessible for all.",
    category: "Tech",
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
    bio: "Digital artist & music producer. Creating worlds through art.",
    category: "Art",
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
    bio: "Business strategist & keynote speaker. Scale your vision.",
    category: "Business",
    verified: true,
    postImages: ["/creators/post-6a.jpg", "/creators/post-6b.jpg", "/creators/post-6c.jpg"],
    postLikes: ["32.1K", "25.4K", "28.9K"],
    postComments: ["876", "654", "745"],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function VerifiedBadge() {
  return (
    <svg className="ml-1 inline-block h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" />
      <path d="M8 12l2.5 2.5L16 9" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CreatorCard({ creator, index }: { creator: typeof creators[0]; index: number }) {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

  return (
    <motion.div
      variants={fadeUp}
      custom={index + 2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="group w-[280px] flex-shrink-0 snap-center sm:w-[300px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/25 hover:shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.15)]">
        {/* Profile header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-[2.5px] ring-primary/30 ring-offset-2 ring-offset-card">
            <Image
              src={creator.avatar}
              alt={creator.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <p className="truncate text-sm font-bold text-foreground">{creator.name}</p>
              {creator.verified && <VerifiedBadge />}
            </div>
            <p className="text-xs text-muted-foreground">{creator.handle}</p>
            <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-[1px] text-[10px] font-semibold text-primary">
              {creator.category}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-around border-y border-border/30 px-4 py-2.5">
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{creator.posts}</p>
            <p className="text-[10px] text-muted-foreground">Posts</p>
          </div>
          <div className="h-6 w-px bg-border/30" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{creator.followers}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div className="h-6 w-px bg-border/30" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{creator.following}</p>
            <p className="text-[10px] text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 py-2.5">
          <p className="text-xs leading-relaxed text-muted-foreground">{creator.bio}</p>
        </div>

        {/* Post grid - 3 posts in a row */}
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
    </motion.div>
  )
}

export function CreatorsStrip() {
  const [scrollPos, setScrollPos] = useState(0)
  const maxScroll = (creators.length - 1) * 310

  function scrollLeft() {
    setScrollPos((prev) => Math.max(prev - 310, 0))
  }
  function scrollRight() {
    setScrollPos((prev) => Math.min(prev + 310, maxScroll))
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px section-divider" />

      {/* Subtle background glow */}
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
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Trusted by top creators
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
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
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
            Join thousands of creators who trust lynkpay.co to monetize their audience, sell digital products, and grow their brand.
          </motion.p>
        </div>

        {/* Desktop: Navigation arrows */}
        <div className="mt-4 hidden items-center justify-center gap-2 sm:flex">
          <button
            onClick={scrollLeft}
            disabled={scrollPos === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground disabled:opacity-30 disabled:hover:border-border/50 disabled:hover:text-muted-foreground"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            disabled={scrollPos >= maxScroll}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground disabled:opacity-30 disabled:hover:border-border/50 disabled:hover:text-muted-foreground"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Cards carousel */}
        <div className="relative mt-10 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" />

          {/* Scrollable track -- native scroll on mobile, animated on desktop */}
          <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:overflow-hidden">
            <motion.div
              className="flex gap-5"
              animate={{ x: -scrollPos }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ minWidth: "max-content" }}
            >
              {creators.map((creator, i) => (
                <CreatorCard key={creator.handle} creator={creator} index={i} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-1.5 sm:hidden">
          {creators.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === Math.round(scrollPos / 310)
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
