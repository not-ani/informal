import { registerRoutes } from "convex-fs";
import { httpRouter } from "convex/server";
import { components } from "./_generated/api";
import { fs } from "./fs";

const http = httpRouter();


registerRoutes(http, components.fs, fs, {
    pathPrefix: "/fs",
    uploadAuth: async () => {
        return true;
    },
    downloadAuth: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      return identity?.subject !== null;
    },
  });
  
  
export default http;
