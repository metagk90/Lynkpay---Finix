"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube, Linkedin, Mail, ArrowRight } from "lucide-react"

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Contact Us", href: "#contact" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "/blogs" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Sitemap", href: "#sitemap" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#help" },
      { label: "Creator Guide", href: "#guide" },
      { label: "API Docs", href: "#api" },
      { label: "Status", href: "#status" },
    ],
  },
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
            <div className="max-w-xs">
              <Link href="/" className="inline-block">
                <Image src="/lynkpay-logo.svg" alt="LynkPay Logo" width={120} height={32} />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Powering the creator economy. Build your mobile webpage, sell your knowledge, and connect with your audience -- all from one link.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Stay in the loop</p>
              <form onSubmit={(e) => e.preventDefault()} className="group mt-3 flex flex-col gap-2 sm:flex-row">
                <input type="email" placeholder="your@email.com" className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  <Mail className="h-3.5 w-3.5" />
                  Subscribe
                </button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.values(footerLinks).map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {"Copyrights \u00A9 2020 PT lynkpayid Indonesia Makmur. All rights reserved."}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} className="flex h-8 w-8 items-center justify-center rounded-full border border-border/30 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary" aria-label={social.label}>
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
