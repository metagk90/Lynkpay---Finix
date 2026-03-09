import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blogs"

type BlogReadPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogReadPage({ params }: BlogReadPageProps) {
  const { slug } = await params
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) notFound()

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mx-auto max-w-3xl">
          <Link href="/blogs" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to blogs
          </Link>
        </div>

        {/* Article header */}
        <article className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
              {post.category}
            </span>
            <span>{post.readTime}</span>
            <span>{post.date}</span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

          {/* Feature image */}
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/30">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>

          {/* Article body */}
          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-pretty text-base leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* In-article CTA */}
          <div className="mt-14 rounded-2xl border border-primary/10 bg-card/60 p-8 text-center sm:p-10">
            <h3 className="text-balance text-xl font-bold tracking-tight text-foreground">
              Ready to apply this in your business?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Build your creator page, launch your offer, and start converting your audience in one place.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Create Free Account
              </Link>
              <Link href="/pricing" className="rounded-full border border-border/50 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </article>

        {/* Related articles */}
        <section className="mx-auto mt-20 max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Related reads</h2>
            <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              View all blogs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/blogs/${item.slug}`} className="group overflow-hidden rounded-2xl border border-border/30 bg-card/60 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[16/10]">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-balance text-base font-bold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
