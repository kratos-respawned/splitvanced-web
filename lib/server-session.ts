"server-only";
import { cookies } from "next/headers";
import { decrypt } from "./jwt";
import { env } from "./env.mjs";
import { JWTPayload } from "@/typings/email-types";
import { db } from "./db";
import { JOSEError } from "jose/errors";
import { ClientUser } from "@/typings/signin-response-types";
import { unstable_noStore } from "next/cache";
class AuthError extends Error {}
export const getServerSession = async (): Promise<
  | {
      user: ClientUser;
      error: null;
    }
  | {
      user: null;
      error: string;
    }
> => {
  try {
    unstable_noStore();
    const token = cookies().get("token");
    if (!token) throw new AuthError("No token found");
    const data = await decrypt<JWTPayload>(token.value, env.SECRET_KEY);
    if (!data.payload.id) throw new AuthError("Invalid token");
    const user = await db.user.findUnique({ where: { id: data.payload.id } });
    if (!user) throw new AuthError("User not found");
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isVerified: user.isVerified,
      },
      error: null,
    };
  } catch (e) {
    let error = "Something went wrong";
    if (e instanceof AuthError) {
      error = e.message;
    } else if (e instanceof JOSEError) {
      error = "Invalid token";
    }
    return {
      user: null,
      error: error,
    };
  }
};
