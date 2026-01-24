import { TaggedError } from "better-result";

export class JsonParseError extends TaggedError("JsonParseError")<{
  message: string;
  input?: unknown;
  cause?: unknown;
}>() {}

export class ValidationError extends TaggedError("ValidationError")<{
  message: string;
  errors: string;
  input?: unknown;
}>() {}

