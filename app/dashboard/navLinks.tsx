"use client";
// import { BackpackIcon, FileIcon, LockClosedIcon } from "lucide-react";
import Link from "next/link";
// import { Navlinks } from "./layout";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Group, UserRound, Users } from "lucide-react";

export const Navlink = ({ name, url }: { name: string; url: string }) => {
  const path = usePathname();
  const Icon = () => {
    if (url.startsWith("/dashboard/groups")) return <Group size={20} />;
    if (url.startsWith("/dashboard/friends")) return <Users size={20} />;
    if (url.startsWith("/dashboard/account")) return <UserRound size={20} />;
  };
  const isActive = path.startsWith(url);
  return (
    <Link
      href={url}
      className={cn(
        " text-xs md:text-base flex gap-2 select-none items-center px-3 py-2 rounded-lg",
        isActive && "bg-primary text-background "
      )}
    >
      <Icon />
      {name}
    </Link>
  );
};
