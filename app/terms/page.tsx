import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms &amp; Conditions (LynkPay)
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: February 10, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p+p]:mt-3">
            <section>
              <p>
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) form a legal agreement between you and LynkPay
                (&ldquo;LynkPay,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). They govern your access to and use of LynkPay&rsquo;s
                platform, including creator pages, tools, checkout experiences, integrations, and related services
                (collectively, the &ldquo;Services&rdquo;).
              </p>
              <p>
                By creating an account, using the Services as a Creator, or purchasing through a LynkPay checkout as a
                Customer, you agree to these Terms.
              </p>
              <p>If you do not agree, do not use the Services.</p>
            </section>

            <section>
              <h2>1. Who we are</h2>
              <p>
                LynkPay provides software that helps creators and businesses publish link-in-bio style pages and
                accept payments for products and services through third-party payment processing partners. LynkPay is
                a technology provider and is not a bank.
              </p>
            </section>

            <section>
              <h2>2. Definitions</h2>
              <ul className="space-y-1">
                <li>Creator: a user who publishes a LynkPay page and offers goods/services.</li>
                <li>Customer: a user who purchases from or supports a Creator through LynkPay.</li>
                <li>Content: any text, images, videos, files, links, listings, or other materials uploaded or displayed through the Services.</li>
                <li>Payment Partner(s): third-party processors/financial service providers that process transactions and/or payouts (including in white-label arrangements).</li>
              </ul>
            </section>

            <section>
              <h2>3. Eligibility and accounts</h2>
              <ul className="space-y-1">
                <li>You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account.</li>
                <li>You agree to provide accurate account details and keep them updated.</li>
                <li>You are responsible for your account credentials and all activity that occurs under your account.</li>
              </ul>
            </section>

            <section>
              <h2>4. Creator obligations</h2>
              <p>Creators are solely responsible for:</p>
              <ul className="space-y-1">
                <li>What they sell/offer, including accuracy of descriptions, pricing, delivery, cancellations, and support.</li>
                <li>Ensuring offerings comply with all applicable laws (consumer protection, marketing, taxes, licensing, privacy, IP, and platform rules).</li>
                <li>Obtaining all rights/permissions needed for Content and any third-party materials used.</li>
                <li>Handling customer inquiries, disputes, and fulfillment in a timely manner.</li>
              </ul>
            </section>

            <section>
              <h2>5. Prohibited activities</h2>
              <p>You may not use the Services to:</p>
              <ul className="space-y-1">
                <li>Violate any law or regulation.</li>
                <li>Facilitate fraud, scams, deception, phishing, or money laundering.</li>
                <li>Infringe intellectual property rights.</li>
                <li>Post or distribute malware or attempt unauthorized access.</li>
                <li>Harass, threaten, exploit, or invade privacy.</li>
                <li>Sell restricted or prohibited products/services (including anything prohibited by Payment Partners).</li>
              </ul>
              <p>
                We may remove Content, restrict features, freeze funds, or suspend/terminate accounts if we believe
                there is a violation or risk.
              </p>
            </section>

            <section>
              <h2>6. Payments, fees, disputes, and refunds</h2>
              <h3>6.1 Payment processing</h3>
              <p>
                Customer payments are processed by Payment Partners (sometimes invisibly/white-labeled via API).
                Payment Partners may require identity checks, fraud checks, and additional documentation.
              </p>
              <p>You agree to comply with any Payment Partner requirements that apply to your use of the Services.</p>

              <h3>6.2 Fees</h3>
              <p>
                LynkPay may charge subscription fees and/or transaction fees as described on our pricing page or
                in-product at the time you select a plan. Fees may change; we&rsquo;ll provide notice where required.
              </p>

              <h3>6.3 Payouts to Creators</h3>
              <p>Creator payouts (if applicable) may be delayed or held to:</p>
              <ul className="space-y-1">
                <li>comply with law or Payment Partner rules,</li>
                <li>manage chargeback/fraud risk, or</li>
                <li>investigate suspected policy violations.</li>
              </ul>

              <h3>6.4 Chargebacks and payment disputes</h3>
              <p>
                If a Customer disputes a transaction (chargeback, reversal, claim), the disputed amount and related
                fees may be deducted from the Creator&rsquo;s balance. Creators agree to provide prompt documentation and
                cooperation to contest disputes.
              </p>

              <h3>6.5 Refunds</h3>
              <p>Refunds are primarily a matter between Creator and Customer unless required by law or Payment Partner policy.</p>
              <ul className="space-y-1">
                <li>Creators must clearly state refund/cancellation terms on their pages.</li>
                <li>Creators must comply with applicable consumer laws in the USA and Canada.</li>
              </ul>
            </section>

            <section>
              <h2>7. Fulfillment: digital products, bookings, and services</h2>
              <p>Creators are responsible for:</p>
              <ul className="space-y-1">
                <li>delivering files/access and ensuring availability as promised,</li>
                <li>managing booking schedules, rescheduling, and cancellations,</li>
                <li>ensuring customers receive required access details for any service or event.</li>
              </ul>
              <p>LynkPay provides tooling but does not guarantee Creator performance.</p>
            </section>

            <section>
              <h2>8. Analytics and integrations</h2>
              <p>
                Creators may enable analytics, pixels, and other integrations. Creators are responsible for obtaining
                any required consents and meeting privacy/legal requirements (including notices related to tracking
                technologies).
              </p>
            </section>

            <section>
              <h2>9. Intellectual property</h2>
              <p>
                LynkPay and its licensors own the Services, including software, design, and branding (excluding Creator Content).
              </p>
              <p>
                Creators retain ownership of their Content but grant LynkPay a worldwide, non-exclusive, royalty-free
                license to host, display, distribute, and process Content solely to operate, improve, and secure the Services.
              </p>
            </section>

            <section>
              <h2>10. Suspension and termination</h2>
              <p>We may suspend or terminate access to the Services if:</p>
              <ul className="space-y-1">
                <li>you violate these Terms or applicable law,</li>
                <li>your activity creates risk to users, LynkPay, or Payment Partners, or</li>
                <li>we are required to do so by law or Payment Partner obligations.</li>
              </ul>
              <p>You may stop using the Services at any time.</p>
            </section>

            <section>
              <h2>11. Disclaimers</h2>
              <p className="uppercase">
                The Services are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not guarantee
                uninterrupted service, error-free operation, or any specific sales or revenue results.
              </p>
            </section>

            <section>
              <h2>12. Limitation of liability</h2>
              <p className="uppercase">
                To the maximum extent permitted by law, LynkPay is not liable for indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill.
              </p>
            </section>

            <section>
              <h2>13. Indemnity</h2>
              <p>
                You agree to defend, indemnify, and hold harmless LynkPay from claims arising out of your Content,
                offerings, conduct, or violation of these Terms or law.
              </p>
            </section>

            <section>
              <h2>14. Governing law and venue (USA/Canada)</h2>
              <p>
                These Terms are governed by the laws of the applicable jurisdiction. Any dispute must be brought in the
                courts located in the relevant jurisdiction, unless otherwise agreed.
              </p>
            </section>

            <section>
              <h2>15. Changes to these Terms</h2>
              <p>
                We may update these Terms. The &ldquo;Last updated&rdquo; date will reflect changes. Continued use after
                updates constitutes acceptance where permitted by law.
              </p>
            </section>

            <section>
              <h2>16. Contact</h2>
              <p>Legal name: LynkPay</p>
              <p>Email: support@lynkpay.co</p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
