"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Instagram, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  { name: "Rina Kartika", handle: "@se.kelas", role: "Online Educator", impact: "3x revenue in 2 months", image: "/user-3.webp", quote: "Sebelum pakai lynkpay.co, saya harus langganan 4 aplikasi berbeda untuk jual e-book, atur jadwal konsultasi, dan terima donasi. Sekarang semuanya satu tempat! Penghasilan saya naik 3x lipat dalam 2 bulan pertama." },
  { name: "Budi Santoso", handle: "@filosofiexcel", role: "Excel & Data Coach", impact: "2.4x course sales", image: "/user-4.webp", quote: "lynkpay.co bikin semua jadi gampang. Saya tinggal upload kursus video, set harga, dan share link di bio Instagram. Murid-murid saya bisa langsung akses tanpa ribet. Simpel banget!" },
  { name: "Ayu Lestari", handle: "@ayucreates", role: "Digital Artist", impact: "41% higher conversions", image: "/user-5.webp", quote: "Sebagai kreator digital, saya butuh platform yang bisa handle semua - jual template, terima komisi, dan booking consultation. lynkpay.co jawaban dari semua kebutuhan saya. Highly recommended!" },
  { name: "Fajar Rahman", handle: "@fajartech", role: "Tech YouTuber", impact: "Booked-out mentoring slots", image: "/user-6.webp", quote: "Platform lain ribet dan mahal. lynkpay.co kasih semua fitur yang saya butuhkan dengan harga terjangkau. Fitur appointment booking-nya game changer buat saya yang sering buka sesi mentoring." },
  { name: "Sari Dewi", handle: "@sariwellness", role: "Wellness Coach", impact: "Weekly class fills faster", image: "/user-7.webp", quote: "Klien saya sekarang bisa booking kelas yoga, beli meal plan, dan ikut workshop langsung dari satu link. Nggak perlu lagi kirim-kirim link berbeda. Terima kasih lynkpay.co!" },
  { name: "Andi Pratama", handle: "@andisound", role: "Music Producer", impact: "Recurring fan support growth", image: "/user-8.webp", quote: "Jual sample pack dan beat jadi jauh lebih mudah. lynkpay.co handle payment, delivery, dan bahkan donasi dari fans. Satu halaman buat semua kebutuhan musik saya." },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = useCallback((dir: number) => {
    setDirection(dir)
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => { paginate(1) }, 6000)
    return () => clearInterval(timer)
  }, [paginate])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const } }),
  }

  const t = testimonials[current]

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Testimonials
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See what people are{" "}
            <span className="text-primary">saying</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-3 text-pretty text-muted-foreground">
            {"No more paying for 5+ different apps! lynkpay.co brings it all home."}
          </motion.p>
        </div>

        <div className="mt-12">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/30 bg-card/60">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) paginate(1)
                  if (info.offset.x > 80) paginate(-1)
                }}
                className="flex flex-col gap-8 p-8 sm:flex-row sm:items-start sm:p-10"
              >
                <div className="flex shrink-0 flex-col items-center gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Instagram className="h-3 w-3" /> {t.handle}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-foreground">{t.role}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">{t.impact}</span>
                  </div>
                  <Quote className="mb-2 h-5 w-5 text-primary/30" />
                  <p className="leading-relaxed text-muted-foreground">{t.quote}</p>
                </div>
            </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => paginate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary" aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }} className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => paginate(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary" aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {testimonials.map((person, i) => (
                <div key={i} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                  <Image src={person.image} alt={person.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Trusted by 10,000+ creators across Indonesia
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
