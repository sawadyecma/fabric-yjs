import * as fabric from "fabric";
import { getYDocStore } from "./createYDocStore";
import { clientOrigin } from "./clientOrigin";
import { txMetaUtil } from "./transaction-meta";

const sendAddedObject = (object: fabric.FabricObject) => {
  const seriarized = object.toObject();
  const { doc, objectMap, objectOrder } = getYDocStore();

  const id = object.id;
  if (!id) {
    console.warn("Object has no id");
    return;
  }

  doc.transact((tr) => {
    txMetaUtil.setOpTypeToTxMeta(tr, "add");
    objectMap.set(id, seriarized);
    objectOrder.push([id]);
  }, clientOrigin);
};

export const sender = {
  sendAddedObject,
};
