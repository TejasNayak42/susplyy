import React from "react";
import Link from "next/link";

import { ShoppingCart, MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Logout from "@/components/Logout";

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
            <Button className="md:flex hidden">Your Orders</Button>
            <Button variant={"link"} className="md:hidden">
              <ShoppingCart />
            </Button>
          </Link>
          <Link href="/customer/track-orders">
            <Button className="md:flex hidden">Track Orders</Button>
            <Button variant={"link"} className="md:hidden">
              <MapPinned />
            </Button>
          </Link>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
