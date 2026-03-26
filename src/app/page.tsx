import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import Newsletter from "@/components/sections/Newsletter";
import Problem from "@/components/sections/Problem";
import HowAIWorks from "@/components/sections/HowAIWorks";
import Solutions from "@/components/sections/Solutions";
import HowItWorks from "@/components/sections/HowItWorks";
import Comparison from "@/components/sections/Comparison";
import Results from "@/components/sections/Results";
import Promises from "@/components/sections/Promises";
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
        <Newsletter />
        {/* Breathing dissolve: dark newsletter → warm off-white */}
        <div
          style={{
            height: "120px",
            background: "linear-gradient(to bottom, #161616 0%, #F5F4EF 100%)",
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
        <FAQ />
        <Contact />
        <About />
      </main>
      <Footer />
    </>
  );
}
