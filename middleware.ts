import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/"],
};
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.cookies.set("vercel", "fast");
  response.cookies.set({
    name: "vercel",
    value: "fast",
    path: "/",
  });
  response.headers.append("x-vercel", "fast");

  return response;
}
