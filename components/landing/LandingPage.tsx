import { CTA } from "./Cta";
import { FeaturesGrid } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { MockupPreview } from "./MockupPreview";
import { Navbar } from "./Navbar";
import { Testimonials } from "./Testimonials";

export default function LandingPage() {
    return (

        <>
            <Navbar />
            <Hero />
            <MockupPreview />
            <FeaturesGrid />
            <HowItWorks />
            <Testimonials />
            <CTA />
            <Footer />
        </>
    )
}
