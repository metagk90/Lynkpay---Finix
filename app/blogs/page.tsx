import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blogs"

export default function BlogsPage() {
  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-border/30 bg-card/30 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium tracking-wide text-primary">
              Creator Blog
            </span>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Practical growth guides for creators
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Learn proven strategies to monetize faster, book better clients, and build consistent revenue.
            </p>
          </div>
        </section>

        {/* Featured post */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Link href={`/blogs/${featured.slug}`} className="group block overflow-hidden rounded-2xl border border-border/30 bg-card/60 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                      {featured.category}
                    </span>
                    <span>{featured.readTime}</span>
                    <span>{featured.date}</span>
                  </div>
                  <h2 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                      Read full article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/signup" className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      Start Free
                    </Link>
                    <Link href="/pricing" className="rounded-full border border-border/50 px-5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
                      View Pricing
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Rest of posts */}
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`} className="group overflow-hidden rounded-2xl border border-border/30 bg-card/60 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-balance text-base font-bold tracking-tight text-foreground">{post.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border/30 bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Want to apply these strategies today?
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
              Create your page, launch your offers, and start converting your audience with one link.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Create Free Account
              </Link>
              <Link href="/service" className="rounded-full border border-border/50 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
