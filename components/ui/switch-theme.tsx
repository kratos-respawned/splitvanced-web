"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
export function ChangeTheme() {
  const theme = useTheme();
  const toggleTheme = () => {
    theme.theme === "dark" ? theme.setTheme("light") : theme.setTheme("dark");
  };
  return (
    <Button variant="outline" size={"icon"} onClick={toggleTheme}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-5 h-5 rotate-180 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
