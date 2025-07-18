import { z } from "zod";

export const formSettingsSchema = z.object({
  oneTime: z.boolean(),
  authRequired: z.boolean(),
});

export type FormSettingsValues = z.infer<typeof formSettingsSchema>; 