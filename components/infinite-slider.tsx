"use client"

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface InfiniteSliderProps<T> {
  /** Data array that drives each slide. */
  items: T[]
  /** Render function that receives the current item and its index. */
  renderSlide: (item: T, index: number) => ReactNode
  /** Auto-play interval in ms. 0 = disabled. @default 4000 */
  interval?: number
  /** Transition variant. @default "slide" */
  transition?: "slide" | "fade" | "scale"
  /** Show dot indicators. @default true */
  showDots?: boolean
  /** Show prev / next arrows. @default true */
  showArrows?: boolean
  /** Show the play/pause toggle. @default true */
  showPlayPause?: boolean
  /** Extra className on the wrapper. */
  className?: string
  /** Height utility class (Tailwind). @default "h-[420px] sm:h-[480px]" */
  heightClass?: string
  /** Pause on hover. @default true */
  pauseOnHover?: boolean
}

/* ------------------------------------------------------------------ */
/*  Transition map                                                     */
/* ------------------------------------------------------------------ */

const transitions = {
  slide: {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    transition: { x: { type: "spring", stiffness: 280, damping: 30 }, opacity: { duration: 0.25 } },
  },
  fade: {
    enter: () => ({ opacity: 0 }),
    center: { opacity: 1 },
    exit: () => ({ opacity: 0 }),
    transition: { opacity: { duration: 0.45, ease: "easeInOut" } },
  },
  scale: {
    enter: (dir: number) => ({ opacity: 0, scale: 0.92, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, scale: 0.92, x: dir > 0 ? -60 : 60 }),
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function InfiniteSlider<T>({
  items,
  renderSlide,
  interval = 4000,
  transition = "slide",
  showDots = true,
  showArrows = true,
  showPlayPause = true,
  className,
  heightClass = "h-[420px] sm:h-[480px]",
  pauseOnHover = true,
}: InfiniteSliderProps<T>) {
  const total = items.length
  const [[current, direction], setCurrent] = useState([0, 0])
  const [isPlaying, setIsPlaying] = useState(interval > 0)
  const [isHovering, setIsHovering] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef(0)

  /* ---- helpers --------------------------------------------------- */

  const wrap = useCallback((i: number) => ((i % total) + total) % total, [total])

  const goTo = useCallback(
    (next: number, dir: number) => setCurrent([wrap(next), dir]),
    [wrap],
  )

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo])

  /* ---- autoplay -------------------------------------------------- */

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isPlaying || interval === 0 || (pauseOnHover && isHovering)) return

    timerRef.current = setTimeout(next, interval)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, isPlaying, interval, isHovering, pauseOnHover, next])

  /* ---- keyboard -------------------------------------------------- */

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
      else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    },
    [next, prev],
  )

  /* ---- touch / swipe --------------------------------------------- */

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  /* ---- transition config ----------------------------------------- */

  const t = transitions[transition]

  /* ---- progress for auto-play bar -------------------------------- */

  const progressKey = `${current}-${isPlaying}-${isHovering}`

  return (
    <div
      className={cn("group relative overflow-hidden rounded-2xl border border-border/30 bg-card/60", heightClass, className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Infinite slider"
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: t.enter,
            center: t.center,
            exit: t.exit,
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={t.transition}
          className="absolute inset-0"
        >
          {renderSlide(items[current], current)}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/70 text-foreground/70 opacity-0 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background/90 hover:text-foreground group-hover:opacity-100 sm:left-4 sm:h-10 sm:w-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/70 text-foreground/70 opacity-0 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background/90 hover:text-foreground group-hover:opacity-100 sm:right-4 sm:h-10 sm:w-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {/* Bottom controls bar */}
      {(showDots || showPlayPause) && total > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-center gap-3 bg-gradient-to-t from-background/80 to-transparent px-4 pb-4 pt-10">
          {/* Play/Pause */}
          {showPlayPause && interval > 0 && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/60 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
          )}

          {/* Dots */}
          {showDots && (
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={cn(
                    "relative h-2 rounded-full transition-all duration-300",
                    i === current
                      ? "w-7 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  {/* Auto-play progress fill inside the active dot */}
                  {i === current && isPlaying && interval > 0 && !(pauseOnHover && isHovering) && (
                    <motion.span
                      key={progressKey}
                      className="absolute inset-y-0 left-0 rounded-full bg-primary-foreground/25"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: interval / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Slide counter */}
          <span className="text-xs tabular-nums text-muted-foreground">
            {current + 1}/{total}
          </span>
        </div>
      )}

      {/* Top-edge auto-play progress bar */}
      {isPlaying && interval > 0 && !(pauseOnHover && isHovering) && (
        <motion.div
          key={progressKey}
          className="absolute inset-x-0 top-0 z-20 h-[2px] origin-left bg-primary/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: "linear" }}
        />
      )}
    </div>
  )
}
