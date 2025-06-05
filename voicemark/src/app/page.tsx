import Features from "@/components/landing-page/Features";
import Footer from "@/components/landing-page/Footer";
import Hero from "@/components/landing-page/Hero";
import Testimonials from "@/components/landing-page/HowItWorks";
import { LandingNavMenu } from "@/components/navigation-menu/LandingNavigationMenu";


export default async function Page() {
return (
    <main className="bg-transparent overflow-y-auto h-screen">
      <div className="snap-container">
        <LandingNavMenu/>
        <section className="h-screen">
          <Hero />
        </section>
        <section className="h-auto">
          <Features />
        </section>
        <section className="h-auto">
          <Testimonials />
        </section>
        <section className="h-auto">
          <Footer />
        </section>
      </div>
    </main>
  );
}