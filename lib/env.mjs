import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    RESEND_KEY: z.string().min(1),
    EMAIL_KEY: z.string().min(1),
    SECRET_KEY: z.string().min(1),
  },
  //   client: {
  //     NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  //   },
  //   only client side env vars are required here
  //   experimental__runtimeEnv: {
  // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  //   }
});
