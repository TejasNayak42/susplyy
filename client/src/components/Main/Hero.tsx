import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="mx-auto min-h-[100dvh] flex justify-center md:flex-row flex-col-reverse px-5 items-center gap-10">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-green-500 to-green-400 text-transparent bg-clip-text pb-5">
          Susply
        </h1>
        <p className="text-lg text-gray-600">
          Unlocking Sustainable Supply Chain solutions with ease.
        </p>
        <div className="mt-5">
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
      <img
        src="/cargo.svg"
        alt="cargo"
        className="md:flex hidden md:w-96 lg:w-[30rem]"
      />
    </div>
  );
}
