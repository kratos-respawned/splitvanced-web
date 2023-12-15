import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChangeTheme } from "@/components/ui/switch-theme";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import { JWTPayload } from "@/typings/email-types";
import { env } from "@/lib/env.mjs";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidatePath, unstable_noStore } from "next/cache";
import { getServerSession } from "@/lib/server-session";
import { LogoutButton } from "@/app/api/logout/logout-button";
export const Navbar = async () => {
  return (
    <header className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-8 md:px-20">
      <Link
        href="/"
        className="text-xl font-black font-cal text-ckAccent md:text-2xl"
      >
        <span className="text-primary">Split</span>Vanced
      </Link>
      <div className="flex items-center gap-3">
        <Suspense fallback={<Skeleton className="h-10 px-9 py-2" />}>
          <NavbarLogin />
        </Suspense>
        <ChangeTheme />
      </div>
    </header>
  );
};

const NavbarLogin = async () => {
  const { user } = await getServerSession();
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <LogoutButton />
      ) : (
        <Link href="/login" className={cn(buttonVariants())}>
          Login
        </Link>
      )}
    </div>
  );
};
