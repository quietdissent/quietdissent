import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowAIWorks from "@/components/sections/HowAIWorks";
import Solutions from "@/components/sections/Solutions";
import HowItWorks from "@/components/sections/HowItWorks";
import Comparison from "@/components/sections/Comparison";
import Results from "@/components/sections/Results";
import Promises from "@/components/sections/Promises";
import Newsletter from "@/components/sections/Newsletter";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        {/* Extended dissolve: dark hero breathes into the light — 280px gives it room */}
        <div
          style={{
            height: "280px",
            background: "linear-gradient(to bottom, #111111 0%, #111111 30%, #F5F4EF 100%)",
            marginBottom: "-1px",
          }}
        />
        <Problem />
        <HowAIWorks />
        <Solutions />
        <HowItWorks />
        <Comparison />
        <Results />
        <Promises />
        {/* Newsletter lands here — after the full narrative, before the FAQ resting point */}
        <Newsletter />
        <FAQ />
        <Contact />
        <About />
      </main>
      <Footer />
    </>
  );
}
