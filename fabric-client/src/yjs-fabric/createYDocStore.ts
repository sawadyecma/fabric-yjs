import * as Y from "yjs";
import { createYjsProvider } from "@y-sweet/client";
import type { ClientToken } from "@y-sweet/sdk";
import * as fabric from "fabric";
import { clientOrigin } from "./clientOrigin";
import type { YDocStoreType } from "./type";

export let YDocStore: YDocStoreType | null = null;
export const getYDocStore = () => {
  if (!YDocStore) {
    throw new Error("YDocStore is not initialized");
  }
  return YDocStore;
};

export const createYDoc = ({ clientToken }: { clientToken: ClientToken }) => {
  const doc = new Y.Doc();
  const docId = clientToken.docId;

  const provider = createYjsProvider(doc, docId, () =>
    Promise.resolve(clientToken)
  );

  const objectMap = doc.getMap<fabric.FabricObject>("objectMap");
  const objectOrder = doc.getArray<string>("objectOrder");
  const undoManager = new Y.UndoManager(doc, {
    trackedOrigins: new Set([clientOrigin]),
  });

  const docStore: YDocStoreType = {
    objectMap,
    objectOrder,
    provider,
    undoManager,
    doc,
  };

  YDocStore = docStore;
  return docStore;
};
