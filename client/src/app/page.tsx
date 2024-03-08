import Features from "@/components/Main/Features";
import Footer from "@/components/Main/Footer";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/Main/Hero"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Main/Navbar"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}

// #21c45d
