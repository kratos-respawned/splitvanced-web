import { formatZodError } from "@/errors/zod-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JOSEError } from "jose/errors";
import { ZodError } from "zod";

export const APIErrorHandler = (err: any) => {
  if (err instanceof ZodError) {
    const error = formatZodError(err);
    return error;
  }
  if (err instanceof JOSEError) {
    if (err.code === "ERR_JWT_EXPIRED") return "Token Expired";

    return "Invalid Token";
  }
  if (err instanceof PrismaClientKnownRequestError) {
    return err.message;
  }
};
