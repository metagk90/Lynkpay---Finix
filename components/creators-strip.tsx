"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram } from "lucide-react"

const creators = [
  { name: "Sarah Wellness", handle: "@sarahwellness", image: "/user-1.webp", followers: "245K" },
  { name: "Mike Fitness", handle: "@mikefitpro", image: "/user-2.webp", followers: "189K" },
  { name: "Ava Styles", handle: "@avastyles", image: "/user-3.webp", followers: "312K" },
  { name: "Dev Patel", handle: "@devteaches", image: "/user-4.webp", followers: "156K" },
  { name: "Luna Beats", handle: "@lunabeats", image: "/user-5.webp", followers: "278K" },
  { name: "James Coach", handle: "@jamescoach", image: "/user-6.webp", followers: "421K" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
}

export function CreatorsStrip() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Best Creators Use{" "}
            <span className="text-primary">lynkpay.co</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-3 text-pretty text-muted-foreground">
            Join thousands of creators who trust lynkpay.co to monetize their audience
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {creators.map((creator, i) => (
            <motion.div key={creator.name} variants={fadeUp} custom={i + 2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="group flex flex-col items-center gap-3 rounded-2xl border border-border/30 bg-card/60 p-4 transition-colors hover:border-primary/20 hover:bg-card">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20">
                <Image src={creator.image} alt={creator.name} fill className="object-cover" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{creator.name}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Instagram className="h-3 w-3" />
                  {creator.handle}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                {creator.followers} followers
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
