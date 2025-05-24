import { z } from "zod";

export const waitlistFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type WaitlistFormData = z.infer<typeof waitlistFormSchema>; 