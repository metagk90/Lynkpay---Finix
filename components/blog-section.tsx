"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { blogPosts } from "@/lib/blogs"

export function BlogSection() {
  const featured = blogPosts.slice(0, 3)

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              From The Blog
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Learn, launch, and grow faster
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-2 text-muted-foreground">
              Actionable guides for creators to monetize better with simple systems.
            </motion.p>
          </div>
          <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            View all blogs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, index) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group overflow-hidden rounded-2xl border border-border/30 bg-card/60 transition-colors hover:border-primary/20 hover:bg-card">
              <div className="relative aspect-video overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{post.category}</span>
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">{post.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <Link href={`/blogs/${post.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Read article
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
