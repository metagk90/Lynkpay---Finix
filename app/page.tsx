import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CreatorsStrip } from "@/components/creators-strip"
import { FeaturesGrid } from "@/components/features-grid"
import { SliderShowcase } from "@/components/slider-showcase"
import { FeatureDetails } from "@/components/feature-details"
import { Testimonials } from "@/components/testimonials"
import { ProductBenefits } from "@/components/product-benefits"
import { TrustedBy } from "@/components/trusted-by"
import { UseCases } from "@/components/use-cases"
import { BlogSection } from "@/components/blog-section"
import { FaqSection } from "@/components/faq-section"
import { SignupCta } from "@/components/signup-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CreatorsStrip />
        <FeaturesGrid />
        <SliderShowcase />
        <FeatureDetails />
        <Testimonials />
        <ProductBenefits />
        <TrustedBy />
        <UseCases />
        <BlogSection />
        <FaqSection />
        <SignupCta />
      </main>
      <Footer />
    </>
  )
}
