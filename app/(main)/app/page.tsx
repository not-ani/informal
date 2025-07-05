import Home from "./inner";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function HomePage() {
  const preloaded = await preloadQuery(api.forms.getUserForms, {}, {
    token: await convexAuthNextjsToken()
  });

  return (
    <main>
      <Home preloaded={preloaded} />
    </main>
  );
}
