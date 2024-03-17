"use client";
import Features from "@/components/Main/Features";
import Footer from "@/components/Main/Footer";
import Hero from "@/components/Main/Hero";
import Mockup from "@/components/Main/Mockup";
import Navbar from "@/components/Main/Navbar";
import FAQ from "@/components/Main/faq";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Mockup />
      <FAQ />
      <Footer />
    </main>
  );
}

// #21c45d
