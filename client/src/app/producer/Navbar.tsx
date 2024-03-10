import React from "react";
import Link from "next/link";

import { Blocks } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Logout from "@/components/Logout";

const Navbar = () => {
  return (
    <div className="fixed backdrop-blur-md top-0 p-5 w-full flex justify-center left-0 z-50 bg-white">
      <div className="flex max-w-6xl w-full justify-between items-center">
        <div>
          <Link href="/producer">
            <Logo />
          </Link>
        </div>
        <div className="flex gap-5">
          <Link href="/producer/add">
            <Button className="md:flex hidden">Add Products</Button>
            <Button variant={"link"} className="md:hidden">
              <Blocks />
            </Button>
          </Link>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
