import { Navbar } from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Navlink } from "./navLinks";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="px-4 md:px-20 pt-32 flex-col lg:flex-row flex gap-x-36 gap-y-5">
        <div className="flex flex-row lg:flex-col   gap-3">
          <Navlink name={"Groups"} url="/dashboard/groups" />
          <Navlink name={"Friends"} url="/dashboard/friends" />
          <Navlink name={"Account"} url="/dashboard/account" />
        </div>
        <section className="flex-grow">{children}</section>
      </main>
    </>
  );
}
