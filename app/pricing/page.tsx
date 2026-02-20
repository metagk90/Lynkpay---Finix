import Link from "next/link"
import { Check, Sparkles, X } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const plans = [
  {
    name: "Basic",
    price: null,
    period: "",
    description: "Get started with essential features to kick off your journey -- no cost, no commitment.",
    cta: "Sign up for free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "/mo",
    description: "Get full access to PRO features and take your business to the next level",
    cta: "Get Pro",
    href: "/signup",
    popular: true,
  },
  {
    name: "Business",
    price: null,
    period: "",
    description: "Get all Basic & Pro features plus customized solutions for your unique business needs.",
    cta: "Contact Us",
    href: "#contact",
    popular: false,
  },
]

const sections = [
  {
    title: "LINK IN BIO",
    rows: [
      { label: "Unlimited Link", values: ["yes", "yes", "yes"] },
      { label: "Analytics", values: ["yes", "yes", "yes"] },
      { label: "Custom Domain", values: ["no", "yes", "yes"] },
      { label: "Custom Appearance", values: ["no", "yes", "yes"] },
      { label: "Remove lynkpay Logo", values: ["no", "yes", "yes"] },
      { label: "Additional page", values: ["2 Pages", "5 pages", "5 pages"] },
      { label: "Public Affiliate links", values: ["5 links", "100 links", "Unlimited"] },
    ],
  },
  {
    title: "STORE IN BIO",
    rows: [
      { label: "Transaction Fee", values: ["10%", "5% / 5% / 3%", "Up to 1%"] },
      { label: "Withdrawal Fee", values: ["Rp 5k", "FREE", "FREE"] },
      { label: "Unlimited Products", values: ["yes", "yes", "yes"] },
      { label: "E-course Video", values: ["10 mins", "480 mins", "Custom"] },
      { label: "Questionnaire Storage", values: ["0 Gb", "20 Gb", "Custom"] },
      { label: "Webhook", values: ["yes", "yes", "yes"] },
      { label: "Google analytics, Meta text", values: ["no", "yes", "yes"] },
      { label: "Whatsapp Broadcast", values: ["no", "yes", "yes"] },
      { label: "Custom Call to Actions", values: ["no", "yes", "yes"] },
      { label: "Custom Review", values: ["no", "yes", "yes"] },
      { label: "Automate Workflow", values: ["no", "yes", "yes"] },
      { label: "Meta Pixel Tracking", values: ["no", "yes", "yes"] },
      { label: "Automatic PDF Watermark", values: ["no", "yes", "yes"] },
    ],
  },
  {
    title: "OTHERS",
    rows: [
      { label: "Team Management", values: ["no", "yes", "yes"] },
      { label: "Consultation", values: ["no", "no", "yes"] },
      { label: "Any Custom Request", values: ["no", "no", "yes"] },
      { label: "Custom Pages", values: ["no", "no", "yes"] },
    ],
  },
]

function CellValue({ value }: { value: string }) {
  if (value === "yes") return <Check className="mx-auto h-4 w-4 text-primary" />
  if (value === "no") return <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  return <span className="text-xs font-medium text-foreground">{value}</span>
}

export default function PricingPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border/30 bg-card/30 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium tracking-wide text-primary">
              <Sparkles className="h-3 w-3" />
              Simple Pricing
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Simple Pricing{" "}
              <span className="text-muted-foreground">that suit your needs</span>
            </h1>
          </div>
        </section>

        {/* Plan cards */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  plan.popular
                    ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/5"
                    : "border-border/30 bg-card/60"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

                {plan.price ? (
                  <div className="mt-4 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold tracking-tight text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                ) : (
                  <div className="mt-4 h-10" />
                )}

                <Link
                  href={plan.href}
                  className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border/50 text-foreground hover:bg-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">Pro</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <>
                    <tr key={section.title}>
                      <td colSpan={4} className="pb-2 pt-6 text-xs font-bold uppercase tracking-wider text-primary">
                        {section.title}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.label} className="border-b border-border/10">
                        <td className="py-3 pr-4 text-sm text-foreground">{row.label}</td>
                        {row.values.map((value, idx) => (
                          <td key={idx} className="px-4 py-3 text-center">
                            <CellValue value={value} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
