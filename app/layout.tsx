import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});
export const metadata: Metadata = {
  title: "SplitVanced",
  description:
    "SplitVanced: Simplify your group expenses. Effortlessly split bills and settle up with friends.",
  keywords: [
    "expense splitting",
    "group bills",
    "bill splitting",
    "split expenses",
    "group payments",
    "SplitVanced",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased transition-colors duration-150",
          fontHeading.variable,
          GeistSans.variable,
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
