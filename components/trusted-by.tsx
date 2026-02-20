"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const logos = [
  { name: "Partner 1", src: "/part-1.webp" },
  { name: "Partner 2", src: "/part-2.webp" },
  { name: "Partner 3", src: "/part-3.webp" },
  { name: "Partner 4", src: "/part-4.webp" },
  { name: "Partner 5", src: "/part-5.webp" },
  { name: "Partner 6", src: "/part-6.webp" },
  { name: "Partner 7", src: "/part-7.webp" },
  { name: "Partner 8", src: "/part-8.webp" },
]

export function TrustedBy() {
  const doubled = [...logos, ...logos]

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Trusted across the creator ecosystem
        </motion.p>

        {/* Infinite scroll marquee */}
        <div className="relative mt-8 overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

          <div
            className="flex w-max gap-8"
            style={{ animation: "scroll 30s linear infinite" }}
          >
            {doubled.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex h-14 w-28 flex-shrink-0 items-center justify-center rounded-xl border border-border/20 bg-card/40 px-4 transition-all hover:border-primary/20 hover:bg-card/70"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={100}
                  height={40}
                  className="h-7 w-auto object-contain opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Plus 500+ creators and communities across Southeast Asia
        </motion.p>
      </div>
    </section>
  )
}
