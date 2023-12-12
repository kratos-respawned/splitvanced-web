import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
export function middleware(request: NextRequest) {
  console.log(request.headers.get("authorization"));
}
