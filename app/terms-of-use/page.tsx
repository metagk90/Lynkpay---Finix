import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfUsePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Use (Website &amp; Browsing)
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: February 10, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p+p]:mt-3">
            <section>
              <p>
                These Terms of Use apply to anyone who visits or uses lynkpay.co, LynkPay landing pages, and Creator
                pages for browsing and viewing (even if you do not create an account). If you create an account, sell,
                or purchase through LynkPay, you should also review the separate Terms &amp; Conditions page.
              </p>
            </section>

            <section>
              <h2>1. Website access and license</h2>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use the website and view
                Creator pages for personal, lawful purposes.
              </p>
              <p>
                You may not copy, scrape, reverse engineer, or commercially exploit the site or its content except
                where explicitly permitted.
              </p>
            </section>

            <section>
              <h2>2. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="space-y-1">
                <li>interfere with site operations or security,</li>
                <li>attempt unauthorized access,</li>
                <li>use automated scraping/crawling beyond reasonable browsing,</li>
                <li>upload or transmit malicious code,</li>
                <li>impersonate others or misrepresent affiliation,</li>
                <li>harass, threaten, or violate privacy.</li>
              </ul>
            </section>

            <section>
              <h2>3. Creator pages and third-party content</h2>
              <p>
                Creator pages and listings are created by third parties (Creators). LynkPay does not endorse or
                guarantee any Creator, product, service, claim, or outcome. Your interactions with Creators are at
                your own risk.
              </p>
            </section>

            <section>
              <h2>4. Intellectual property</h2>
              <p>
                All LynkPay branding, logos, site design, and platform software are owned by LynkPay or its licensors.
                You may not use our trademarks without written permission.
              </p>
            </section>

            <section>
              <h2>5. Third-party links</h2>
              <p>
                The site may include links to third-party services. We are not responsible for third-party content,
                security, or policies.
              </p>
            </section>

            <section>
              <h2>6. Copyright complaints (DMCA - USA)</h2>
              <p>If you believe content on LynkPay infringes copyright, email support@lynkpay.co with:</p>
              <ul className="space-y-1">
                <li>identification of the copyrighted work,</li>
                <li>where the allegedly infringing material appears (URL),</li>
                <li>your contact info,</li>
                <li>a good-faith statement the use is unauthorized,</li>
                <li>a statement under penalty of perjury that the info is accurate,</li>
                <li>your electronic signature.</li>
              </ul>
            </section>

            <section>
              <h2>7. Disclaimers</h2>
              <p className="uppercase">
                The website and content are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not warrant that the site
                will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2>8. Limitation of liability</h2>
              <p className="uppercase">
                To the maximum extent permitted by law, LynkPay is not liable for indirect, incidental, special,
                consequential, or punitive damages arising from your use of or inability to use the site.
              </p>
            </section>

            <section>
              <h2>9. Changes</h2>
              <p>
                We may update these Terms of Use at any time. The &ldquo;Last updated&rdquo; date reflects the current version.
              </p>
            </section>

            <section>
              <h2>10. Governing law</h2>
              <p>
                These Terms of Use are governed by and construed in accordance with the applicable laws, and any
                disputes arising out of or relating to these Terms will be resolved in the courts of competent
                jurisdiction, unless otherwise required by law.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>Email: support@lynkpay.co</p>
              <p>Legal name: LynkPay</p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
