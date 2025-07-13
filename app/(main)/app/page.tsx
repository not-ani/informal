import Home from "./inner";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";

export default async function HomePage() {
  const token = await getAuthToken()
  const preloaded = await preloadQuery(api.forms.getUserForms, {}, {
    token: token
  });

  return (
    <main>
      <Home preloaded={preloaded} />
    </main>
  );
}
