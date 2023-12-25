import * as z from "zod";

export const groupSchema = z.object({
  name: z.string().min(3).max(25),
});
export type groupSchema = z.infer<typeof groupSchema>;
