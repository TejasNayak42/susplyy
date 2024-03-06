import Hero from "@/components/Main/Hero";
import Navbar from "@/components/Main/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}
