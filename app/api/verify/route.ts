import { db } from "@/lib/db";
import { env } from "@/lib/env.mjs";
import { APIErrorHandler } from "@/lib/error-handler";
import { decrypt } from "@/lib/jwt";
import { JWTPayload } from "@/typings/email-types";
import { SignInResponse } from "@/typings/signin-response-types";
import { JOSEError } from "jose/errors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("token");
    if (!id) {
      throw new JOSEError("Invalid Token");
    }
    const payload = await decrypt<JWTPayload>(id, env.EMAIL_KEY);
    if (!payload.payload.id) {
      throw new JOSEError("Invalid Token");
    }

    const user = await db.user.update({
      where: {
        id: payload.payload.id,
        isVerified: false,
      },
      data: {
        isVerified: true,
      },
    });
    return new Response(`Hello ${user.name}`);
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    if (errMessage)
      return Response.json(
        {
          status: "unauthenticated",
          error: errMessage,
        } as SignInResponse,
        { status: 400 }
      );
    else
      return Response.json(
        {
          status: "unauthenticated",
          error: "Something went wrong",
        } as SignInResponse,
        { status: 500 }
      );
  }
}
