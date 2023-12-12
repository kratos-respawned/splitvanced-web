"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ChangeTheme } from "./ui/switch-theme";
export const Navbar = () => {
  return (
    <header className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-8 md:px-20">
      <Link
        href="/"
        className="text-xl font-black font-cal text-ckAccent md:text-2xl"
      >
        <span className="text-primary">Split</span>Vanced
      </Link>
      {/* <div className="flex items-center gap-3"> */}
      {/* <Link href="/login" className={cn(buttonVariants())}>
          Login
        </Link> */}
      <ChangeTheme />
      {/* </div> */}
    </header>
  );
};
