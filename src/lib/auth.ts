import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAuthToken(): Promise<string | undefined> {
  const template = "convex";
  const token =
    (await auth()).getToken({
      template,
    }) ?? undefined;
  return token ?? undefined;
}
