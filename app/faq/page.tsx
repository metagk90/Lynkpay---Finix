import { Sparkles } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What can I sell on lynkpay.co?",
    answer:
      "You can sell digital products, courses, appointments, paid events, and accept support from your audience, all from one creator page.",
  },
  {
    question: "Do I need coding skills to get started?",
    answer:
      "No coding is required. You can set up your page, add offers, and start sharing your link in minutes.",
  },
  {
    question: "How do I receive payments?",
    answer:
      "Payments are collected through checkout and transferred to your linked payout method based on your account setup and plan.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes, custom domain is available on higher plans so your creator page can match your personal brand.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. You can begin with the free plan and upgrade when you need more advanced features.",
  },
  {
    question: "Can my team manage the page with me?",
    answer:
      "Yes, team and collaboration features are available on advanced plans for business use cases.",
  },
]

export default function FaqPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border/30 bg-card/30 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium tracking-wide text-primary">
              <Sparkles className="h-3 w-3" />
              FAQ
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Everything you need to know before you launch, sell, and scale with lynkpay.co.
            </p>
          </div>
        </section>

        {/* FAQ accordion */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="rounded-xl border border-border/30 bg-card/60 px-5">
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground sm:text-base [&>svg]:text-muted-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
