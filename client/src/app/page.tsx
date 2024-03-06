import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center flex-col gap-5 min-h-[100dvh] items-center">
      <div className="flex justify-center items-center">
        {/* <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-400 text-transparent bg-clip-text">
          Susply
        </div> */}
        <div className="text-4xl font-bold text-[#21c45d]">Susply</div>
        <img src="/cargo.svg" alt="cargo" className="w-40" />
      </div>
      <Link href="/login">
        <Button>Get Started</Button>
      </Link>
    </main>
  );
}
