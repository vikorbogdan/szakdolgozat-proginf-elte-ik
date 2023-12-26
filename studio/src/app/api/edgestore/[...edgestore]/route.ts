import allowedAttachmentFileTypes from "@/lib/allowedAttachmentFileTypes";
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { initEdgeStoreClient } from "@edgestore/server/core";
const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({
      accept: allowedAttachmentFileTypes,
      maxSize: 1024 * 1024 * 10, // 10MB
    })
    .beforeDelete(() => {
      return true; // allow delete
    }),
  publicImages: es.imageBucket(),
});
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});
export const backendEdgeClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});
export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
