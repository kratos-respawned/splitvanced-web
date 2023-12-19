import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/jwt";
import { JWTPayload } from "./typings/email-types";
import { env } from "./lib/env.mjs";
import { SignInResponse } from "./validatiors/signinResponse-schema";
import { APIErrorHandler } from "./lib/error-handler";
import { JOSEError } from "jose/errors";
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};
export async function middleware(request: NextRequest) {
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  const resp: SignInResponse = {
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
    return Response.json(resp);
  }
  try {
    const payload = await decrypt<JWTPayload>(token.value, env.SECRET_KEY);
    if (!payload.payload.id) {
      return Response.json(resp);
    }
    return NextResponse.next();
  } catch (error) {
    let errMessage: string;
    if (error instanceof JOSEError) {
      if (error.code === "ERR_JWT_EXPIRED") errMessage = "Token Expired";
      errMessage = "Invalid Token";
    } else {
      errMessage = "Something went wrong";
    }
    return Response.json({
      status: "unauthenticated",
      error: errMessage,
    });
  }
}
