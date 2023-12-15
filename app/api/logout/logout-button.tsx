"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
export const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/logout");
        router.refresh();
        setLoading(false);
      }}
    >
      Logout
    </Button>
  );
};
