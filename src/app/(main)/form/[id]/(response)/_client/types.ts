import { api } from "@convex/_generated/api";
import { Preloaded } from "convex/react";
import { FunctionReturnType } from "convex/server";

export type PreloadedData = Preloaded<typeof api.forms.getFormContext>;
export type PreloadedOwnership = Preloaded<typeof api.forms.checkFormOwnership>;

export type QueryData = FunctionReturnType<typeof api.forms.getFormContext>;
