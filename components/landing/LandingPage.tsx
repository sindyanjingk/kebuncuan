import { CTA } from "./Cta";
import { FeaturesGrid } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { MockupPreview } from "./MockupPreview";
import { Navbar } from "./Navbar";
import { TestimonialsSection } from "./TestimonialsNew";
import { ServicesSection } from "./Services";
import { ContactSection } from "./Contact";
import { PortfolioSection } from "./Portfolio";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <FeaturesGrid />
            <ServicesSection />
            <PortfolioSection />
            <TestimonialsSection />
            <ContactSection />
            <Footer />
        </>
    )
}
