import * as z from "zod";

export const friendshipSchema = z.object({
  id: z.string(),
});

export const friendshipRequestActionSchema = z.object({
  accepted: z.boolean(),
})