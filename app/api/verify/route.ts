import { db } from "@/lib/db";
import { env } from "@/lib/env.mjs";
import { decrypt } from "@/lib/jwt";
import { MailJWTPayload } from "@/typings/email-types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("token");
  if (!id) {
    return new Response("Invalid Token", { status: 400 });
  }
  const payload = await decrypt<MailJWTPayload>(id, env.EMAIL_KEY);
  const user = await db.user.update({
    where: {
      id: payload.payload.id,
    },
    data: {
      isVerified: true,
    },
  });
  return new Response(`Hello ${user.name}`);
}
