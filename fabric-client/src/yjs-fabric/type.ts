import * as Y from "yjs";
import { YSweetProvider } from "@y-sweet/client";
import * as fabric from "fabric";

export type YDocStoreType = {
  objectMap: Y.Map<fabric.FabricObject>;
  objectOrder: Y.Array<string>;
  provider: YSweetProvider;
  undoManager: Y.UndoManager;
  doc: Y.Doc;
};

export type ObserveObjectMapFn = Parameters<
  YDocStoreType["objectMap"]["observe"]
>[0];
export type ObserveObjectOrderFn = Parameters<
  YDocStoreType["objectOrder"]["observe"]
>[0];
