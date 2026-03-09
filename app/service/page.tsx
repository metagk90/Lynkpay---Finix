import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const services = [
  {
    title: "Creator Page Setup",
    description: "Launch a branded mobile page with your links, products, and booking options.",
  },
  {
    title: "Digital Product Selling",
    description: "Sell ebooks, templates, and files with a clean checkout and simple delivery flow.",
  },
  {
    title: "Coaching & Appointments",
    description: "Let clients book 1-on-1 sessions with your availability and payment settings.",
  },
]

export default function ServicePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border/30 bg-card/30 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium tracking-wide text-primary">
              What We Offer
            </span>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our Services
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Simple solutions to help creators build, sell, and grow online without complexity.
            </p>
          </div>
        </section>

        {/* Service cards */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="flex flex-col rounded-2xl border border-border/30 bg-card/60 p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/30 bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <Link href="/pricing" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              View Pricing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
