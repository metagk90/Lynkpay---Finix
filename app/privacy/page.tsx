import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy (LynkPay)
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: February 10, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p+p]:mt-3">
            <section>
              <p>
                This Privacy Policy explains how LynkPay (&ldquo;LynkPay,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
                collects, uses, discloses, and protects personal information when you use our websites and Services in
                the USA and Canada.
              </p>
            </section>

            <section>
              <h2>1. What this Policy covers</h2>
              <p>This Policy applies to:</p>
              <ul className="space-y-1">
                <li>visitors to lynkpay.co and related pages,</li>
                <li>Creators who register and use LynkPay, and</li>
                <li>Customers who purchase from Creators via LynkPay checkout.</li>
              </ul>
            </section>

            <section>
              <h2>2. Information we collect</h2>
              <h3>2.1 Information you provide</h3>
              <ul className="space-y-1">
                <li>Account details (name, email, username, password)</li>
                <li>Creator profile/page information (bio, links, listings, content uploads)</li>
                <li>Support messages and communications</li>
              </ul>
              <h3>2.2 Transaction and service data</h3>
              <ul className="space-y-1">
                <li>Purchase details (items/services purchased, amount, timestamps, status)</li>
                <li>Order fulfillment metadata (delivery status, access logs where applicable)</li>
                <li>Dispute/chargeback information and related communications</li>
              </ul>
              <h3>2.3 Payment information</h3>
              <p>
                Payments are processed by Payment Partners. We generally do not store full card numbers. Payment
                Partners may collect payment credentials, perform identity verification, and conduct fraud screening.
              </p>
              <h3>2.4 Automatically collected data (cookies/logs)</h3>
              <ul className="space-y-1">
                <li>IP address, device/browser type, operating system</li>
                <li>Usage events (page views, clicks, referrals, timestamps)</li>
                <li>Cookies and similar technologies for functionality, analytics, and measurement</li>
              </ul>
            </section>

            <section>
              <h2>3. How we use personal information</h2>
              <p>We use personal information to:</p>
              <ul className="space-y-1">
                <li>provide and operate the Services (pages, checkout, delivery, bookings)</li>
                <li>process transactions and payouts via Payment Partners</li>
                <li>prevent fraud and secure accounts</li>
                <li>provide customer support</li>
                <li>improve performance, troubleshooting, and product development</li>
                <li>send service messages (e.g., receipts, security alerts, platform updates)</li>
                <li>send marketing communications where permitted (you may opt out)</li>
              </ul>
            </section>

            <section>
              <h2>4. How we disclose personal information</h2>
              <p>We may disclose personal information to:</p>
              <ul className="space-y-1">
                <li>Payment Partners to process payments/payouts and manage disputes/fraud</li>
                <li>Service providers (hosting, analytics, support tools, email delivery, security)</li>
                <li>Creators (to fulfill a Customer&rsquo;s purchase and provide support)</li>
                <li>Legal/compliance (when required by law or to protect rights/safety)</li>
                <li>Business transfers (merger, acquisition, or asset sale, with safeguards)</li>
              </ul>
              <p>
                We do not sell personal information in the traditional sense. Some analytics/advertising tools may be
                considered &ldquo;sharing&rdquo; under certain US state laws; see Section 9.
              </p>
            </section>

            <section>
              <h2>5. Cookies and tracking technologies</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="space-y-1">
                <li>essential site features,</li>
                <li>analytics/performance,</li>
                <li>measurement and marketing (where enabled).</li>
              </ul>
              <p>
                Creators may also enable tracking (e.g., pixels/analytics) on their own pages. Creators are
                responsible for presenting required notices/consent prompts where applicable.
              </p>
            </section>

            <section>
              <h2>6. Data retention</h2>
              <p>We retain personal information for as long as necessary to:</p>
              <ul className="space-y-1">
                <li>provide Services,</li>
                <li>comply with legal/accounting obligations,</li>
                <li>resolve disputes, and</li>
                <li>enforce our agreements.</li>
              </ul>
            </section>

            <section>
              <h2>7. Security</h2>
              <p>
                We use reasonable administrative, technical, and organizational safeguards designed to protect
                information. No system is perfectly secure.
              </p>
            </section>

            <section>
              <h2>8. International processing (USA/Canada)</h2>
              <p>
                Your information may be processed in the USA, Canada, and other jurisdictions where we or our vendors
                operate. We take steps to protect cross-border processing consistent with applicable law.
              </p>
            </section>

            <section>
              <h2>9. Your rights (USA and Canada)</h2>
              <h3>Canada (PIPEDA)</h3>
              <p>
                You may request access to and correction of your personal information, and ask questions about our
                handling of it.
              </p>
              <h3>USA (state privacy laws)</h3>
              <p>Depending on your state, you may have rights to:</p>
              <ul className="space-y-1">
                <li>access, correct, or delete personal information,</li>
                <li>opt out of certain sharing for targeted advertising,</li>
                <li>limit certain uses of sensitive personal data (where applicable).</li>
              </ul>
              <p>To make a request, email support@lynkpay.co. We may need to verify your identity.</p>
            </section>

            <section>
              <h2>10. Children</h2>
              <p>
                The Services are not intended for children under 13. If we learn we collected personal data from a
                child under 13, we will delete it.
              </p>
            </section>

            <section>
              <h2>11. Changes to this Policy</h2>
              <p>
                We may update this Policy and will revise the &ldquo;Last updated&rdquo; date. We will provide
                additional notice if required by law.
              </p>
            </section>

            <section>
              <h2>12. Contact</h2>
              <p>Privacy email: support@lynkpay.co</p>
              <p>Legal name: LynkPay</p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
