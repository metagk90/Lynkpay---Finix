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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
  }),
}

export function TrustedBy() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Trusted across the{" "}
          <span className="text-primary">creator ecosystem</span>
        </motion.h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((logo, i) => (
            <motion.div key={logo.name} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center justify-center rounded-xl border border-border/20 bg-card/40 p-4">
              <Image src={logo.src} alt={logo.name} width={100} height={40} className="h-8 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-6 text-center text-sm text-muted-foreground">
          Plus 500+ creators and communities across Southeast Asia
        </motion.p>
      </div>
    </section>
  )
}
