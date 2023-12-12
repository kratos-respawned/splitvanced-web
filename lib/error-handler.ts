import { formatZodError } from "@/errors/zod-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JOSEError } from "jose/errors";
import { ZodError } from "zod";

export const APIErrorHandler = (err: any) => {
  if (err instanceof ZodError) {
    const error = formatZodError(err);
    return new Response(error, { status: 400 });
  }
  if (err instanceof JOSEError) {
    if (err.code === "ERR_JWT_EXPIRED")
      return new Response("Token Expired", { status: 400 });
    return new Response("Invalid Token", { status: 400 });
  }
  if (err instanceof PrismaClientKnownRequestError) {
    return new Response(err.message, { status: 400 });
  }
  return new Response(`Internal Server Error`, { status: 500 });
};
