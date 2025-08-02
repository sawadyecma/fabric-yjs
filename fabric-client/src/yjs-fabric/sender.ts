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

const sendRemovedObject = (object: fabric.FabricObject) => {
  const id = object.id;
  if (!id) {
    console.warn("Object has no id");
    return;
  }
  const { doc, objectMap, objectOrder } = getYDocStore();

  // すでに削除済みの時は送信しない
  const _object = objectMap.get(id);
  if (!_object) {
    console.warn("Object not found");
    return;
  }

  console.log(`id: ${id} will be removed`);

  doc.transact((tr) => {
    txMetaUtil.setOpTypeToTxMeta(tr, "remove");
    objectMap.delete(id);
    const index = objectOrder.toArray().indexOf(id);
    objectOrder.delete(index);
  }, clientOrigin);
};

export const sender = {
  sendAddedObject,
  sendRemovedObject,
};
