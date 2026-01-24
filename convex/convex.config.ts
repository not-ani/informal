import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config.js";
import fs from "convex-fs/convex.config.js";

const app = defineApp();
app.use(rateLimiter);
app.use(fs);

export default app;