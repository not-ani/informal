/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as collaborators from "../collaborators.js";
import type * as form_fields from "../form_fields.js";
import type * as form_responses from "../form_responses.js";
import type * as forms from "../forms.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as waitlist from "../waitlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  collaborators: typeof collaborators;
  form_fields: typeof form_fields;
  form_responses: typeof form_responses;
  forms: typeof forms;
  http: typeof http;
  myFunctions: typeof myFunctions;
  waitlist: typeof waitlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
