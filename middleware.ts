import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/jwt";
import { JWTPayload } from "./typings/email-types";
import { env } from "./lib/env.mjs";
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
export async function middleware(request: NextRequest) {
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  const resp = {
    status: "unauthenticated",
    error: "Please login",
  };

  if (
    request.url.includes("/api/signin") ||
    request.url.includes("/api/verify") ||
    request.url.includes("/api/logout")
  ) {
    return NextResponse.next();
  }
  const token = cookies().get("token");
  if (!token) {
    return Response.json(resp, { status: 400 });
  }
  const payload = await decrypt<JWTPayload>(token.value, env.SECRET_KEY);
  if (!payload.payload.id) {
    return Response.json(resp, { status: 400 });
  }
  return NextResponse.next();
}
