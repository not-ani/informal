/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as collaborators from "../collaborators.js";
import type * as fields from "../fields.js";
import type * as files from "../files.js";
import type * as forms from "../forms.js";
import type * as fs from "../fs.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as rateLimit from "../rateLimit.js";
import type * as responses from "../responses.js";
import type * as sections from "../sections.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  fields: typeof fields;
  files: typeof files;
  forms: typeof forms;
  fs: typeof fs;
  helpers: typeof helpers;
  http: typeof http;
  myFunctions: typeof myFunctions;
  rateLimit: typeof rateLimit;
  responses: typeof responses;
  sections: typeof sections;
  waitlist: typeof waitlist;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
  fs: {
    lib: {
      commitFiles: FunctionReference<
        "mutation",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          files: Array<{
            attributes?: { expiresAt?: number };
            basis?: null | string;
            blobId: string;
            path: string;
          }>;
        },
        null
      >;
      copyByPath: FunctionReference<
        "mutation",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          destPath: string;
          sourcePath: string;
        },
        null
      >;
      deleteByPath: FunctionReference<
        "mutation",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          path: string;
        },
        null
      >;
      getDownloadUrl: FunctionReference<
        "action",
        "internal",
        {
          blobId: string;
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          extraParams?: Record<string, string>;
        },
        string
      >;
      list: FunctionReference<
        "query",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          prefix?: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            attributes?: { expiresAt?: number };
            blobId: string;
            contentType: string;
            path: string;
            size: number;
          }>;
        }
      >;
      moveByPath: FunctionReference<
        "mutation",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          destPath: string;
          sourcePath: string;
        },
        null
      >;
      registerPendingUpload: FunctionReference<
        "mutation",
        "internal",
        {
          blobId: string;
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          contentType: string;
          size: number;
        },
        null
      >;
      stat: FunctionReference<
        "query",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          path: string;
        },
        null | {
          attributes?: { expiresAt?: number };
          blobId: string;
          contentType: string;
          path: string;
          size: number;
        }
      >;
      transact: FunctionReference<
        "mutation",
        "internal",
        {
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          ops: Array<
            | {
                dest: { basis?: null | string; path: string };
                op: "move";
                source: {
                  attributes?: { expiresAt?: number };
                  blobId: string;
                  contentType: string;
                  path: string;
                  size: number;
                };
              }
            | {
                dest: { basis?: null | string; path: string };
                op: "copy";
                source: {
                  attributes?: { expiresAt?: number };
                  blobId: string;
                  contentType: string;
                  path: string;
                  size: number;
                };
              }
            | {
                op: "delete";
                source: {
                  attributes?: { expiresAt?: number };
                  blobId: string;
                  contentType: string;
                  path: string;
                  size: number;
                };
              }
            | {
                attributes: { expiresAt?: null | number };
                op: "setAttributes";
                source: {
                  attributes?: { expiresAt?: number };
                  blobId: string;
                  contentType: string;
                  path: string;
                  size: number;
                };
              }
          >;
        },
        null
      >;
    };
    ops: {
      basics: {
        copyByPath: FunctionReference<
          "mutation",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            destPath: string;
            sourcePath: string;
          },
          null
        >;
        deleteByPath: FunctionReference<
          "mutation",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            path: string;
          },
          null
        >;
        list: FunctionReference<
          "query",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            paginationOpts: {
              cursor: string | null;
              endCursor?: string | null;
              id?: number;
              maximumBytesRead?: number;
              maximumRowsRead?: number;
              numItems: number;
            };
            prefix?: string;
          },
          {
            continueCursor: string;
            isDone: boolean;
            page: Array<{
              attributes?: { expiresAt?: number };
              blobId: string;
              contentType: string;
              path: string;
              size: number;
            }>;
          }
        >;
        moveByPath: FunctionReference<
          "mutation",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            destPath: string;
            sourcePath: string;
          },
          null
        >;
        stat: FunctionReference<
          "query",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            path: string;
          },
          null | {
            attributes?: { expiresAt?: number };
            blobId: string;
            contentType: string;
            path: string;
            size: number;
          }
        >;
      };
      transact: {
        commitFiles: FunctionReference<
          "mutation",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            files: Array<{
              attributes?: { expiresAt?: number };
              basis?: null | string;
              blobId: string;
              path: string;
            }>;
          },
          null
        >;
        transact: FunctionReference<
          "mutation",
          "internal",
          {
            config: {
              blobGracePeriod?: number;
              downloadUrlTtl?: number;
              storage:
                | {
                    apiKey: string;
                    cdnHostname: string;
                    region?: string;
                    storageZoneName: string;
                    tokenKey?: string;
                    type: "bunny";
                  }
                | { type: "test" };
            };
            ops: Array<
              | {
                  dest: { basis?: null | string; path: string };
                  op: "move";
                  source: {
                    attributes?: { expiresAt?: number };
                    blobId: string;
                    contentType: string;
                    path: string;
                    size: number;
                  };
                }
              | {
                  dest: { basis?: null | string; path: string };
                  op: "copy";
                  source: {
                    attributes?: { expiresAt?: number };
                    blobId: string;
                    contentType: string;
                    path: string;
                    size: number;
                  };
                }
              | {
                  op: "delete";
                  source: {
                    attributes?: { expiresAt?: number };
                    blobId: string;
                    contentType: string;
                    path: string;
                    size: number;
                  };
                }
              | {
                  attributes: { expiresAt?: null | number };
                  op: "setAttributes";
                  source: {
                    attributes?: { expiresAt?: number };
                    blobId: string;
                    contentType: string;
                    path: string;
                    size: number;
                  };
                }
            >;
          },
          null
        >;
      };
    };
    transfer: {
      getDownloadUrl: FunctionReference<
        "action",
        "internal",
        {
          blobId: string;
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          extraParams?: Record<string, string>;
        },
        string
      >;
      registerPendingUpload: FunctionReference<
        "mutation",
        "internal",
        {
          blobId: string;
          config: {
            blobGracePeriod?: number;
            downloadUrlTtl?: number;
            storage:
              | {
                  apiKey: string;
                  cdnHostname: string;
                  region?: string;
                  storageZoneName: string;
                  tokenKey?: string;
                  type: "bunny";
                }
              | { type: "test" };
          };
          contentType: string;
          size: number;
        },
        null
      >;
    };
  };
};
