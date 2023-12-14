import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" h-screen pb-28 px-7 ">
      <Navbar />
      <section className="h-[100dvh] grid place-items-center w-full ">
        <div className="relative text-center ">
          <figure
            aria-hidden
            className="absolute rounded-full bg-primary w-44 aspect-square blur-3xl -top-10 -left-10 aria-disabled -z-10 "
          >
            <figure className="absolute top-0 w-24 rounded-full bg-ckAccent aspect-square " />
          </figure>
          <h1 className=" text-balance  text-[clamp(2.5rem,10vw,5rem)]  font-cal py-2">
            A Better Way <br /> to{" "}
            <span className="underline decoration-wavy decoration-primary ">
              Split
            </span>{" "}
            Your Bills
          </h1>
          <p className="text-[clamp(1rem,5vw,1.5rem)]  font-sans pb-3">
            Effortlessly Split, Happily Settle!
          </p>
          <div className="flex items-center justify-center gap-x-4">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({
                  variant: "default",
                  className: "",
                })
              )}
            >
              Get Started
            </Link>
            <Button variant={"outline"}>Dummy Button</Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
