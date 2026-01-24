import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
    // Rate limit form submissions: 10 submissions per hour per email
    submitForm: { kind: "fixed window", rate: 10, period: HOUR },
    adminRead: { kind: "token bucket", rate: 50, period: MINUTE, capacity: 10 },
});

