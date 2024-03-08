import React, { useEffect, useState } from "react";

import { LogOut, Container } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deserialize } from "v8";
import Image from "next/image";
import Logo from "@/components/Logo";
const Navbar = () => {
  return (
    <div className="fixed backdrop-blur-md top-0 p-5 w-full flex justify-center left-0 z-50 bg-white">
      <div className="flex max-w-6xl w-full justify-between items-center">
        <div>
          <Link href="/customer">
            <Logo />
          </Link>
        </div>
        <div className="flex gap-5">
          <Link href="/customer/orders">
            <Button>Your Orders</Button>
          </Link>
          <Link href="/customer/track-orders">
            <Button>Track Orders</Button>
          </Link>
          <Link href="/">
            <LogOut className="h-full text-red-500 hover:scale-105 transition-all duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
