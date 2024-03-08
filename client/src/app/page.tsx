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
    </main>
  );
}
