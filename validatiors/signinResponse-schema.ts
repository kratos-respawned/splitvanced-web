import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const authenticatedSchema = z.object({
  status: z.literal("authenticated"),
  user: userSchema,
});

const unauthenticatedSchema = z.object({
  status: z.literal("unauthenticated"),
  error: z.string(),
});

const unverifiedSchema = z.object({
  status: z.literal("unverified"),
  error: z.string(),
});

export const SignInResponseSchema = z.union([
  authenticatedSchema,
  unauthenticatedSchema,
  unverifiedSchema,
]);

export type SignInResponse = z.infer<typeof SignInResponseSchema>;
