import { Sparkles } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  { question: "What can I sell on lynkpay.co?", answer: "You can sell digital products, courses, appointments, paid events, and accept support from your audience. Everything is managed from a single creator page." },
  { question: "Do I need coding skills to set up my page?", answer: "No. You can set up your page, add products, and publish in minutes without writing code. The platform is built for creators and small teams." },
  { question: "How do I receive payments?", answer: "Payments are collected through the platform checkout flow and then transferred to your linked payout account according to your selected plan and payout settings." },
  { question: "Can I use my own domain?", answer: "Yes. Custom domain support is available on higher plans, so your page can match your brand identity and look more professional." },
  { question: "Is there a free plan?", answer: "Yes. You can start with the free tier and upgrade later when you need advanced features like deeper analytics, automation, and more customization." },
  { question: "Can I manage this with my team?", answer: "Yes. Team-oriented features are available on advanced plans, making it easier to collaborate on content, offers, and operations." },
]

export function FaqSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              FAQ
            </span>
            <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Quick answers about setup, selling, payments, and scaling your creator business.
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/30">
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
