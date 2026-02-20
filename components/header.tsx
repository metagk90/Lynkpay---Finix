"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Service", href: "/service" },
  { label: "FAQ", href: "/faq" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="LynkPay Logo" width={120} height={32} priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign In
          </Link>
          <Link href="/signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            SIGN UP FREE
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="flex items-center justify-center md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-border/50 bg-background md:hidden">
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="mt-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90" onClick={() => setMobileMenuOpen(false)}>
                SIGN UP FREE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
