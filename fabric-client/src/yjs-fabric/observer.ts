import { showToast } from "../dom/toast";
import { getFabricCanvas } from "../fabric/init-fabric";
import { clientOrigin } from "./clientOrigin";
import { getYDocStore } from "./createYDocStore";
import { receiver } from "./receiver";
import { txMetaUtil } from "./transaction-meta";
import type {
  ObserveObjectMapFn,
  ObserveObjectOrderFn,
  YDocStoreType,
} from "./type";

const observeObjectMap: ObserveObjectMapFn = (event, transaction) => {
  if (transaction.origin === clientOrigin) {
    // opTypeは同じクライアントでしか取得できないため、注意
    const opType = txMetaUtil.getOpTypeFromTxMeta(transaction);
    if (opType === "modify") return;
    if (opType === "add") return;
    if (opType === "remove") return;
  }

  const { objectMap } = getYDocStore();

  event.keysChanged.forEach((key) => {
    const object = objectMap.get(key);
    if (!object) return;
    receiver.receiveModifiedObject(object);
  });
  return;
};

const observeObjectOrder: ObserveObjectOrderFn = (event, transaction) => {
  const { objectMap } = getYDocStore();
  let index: number = 0;

  if (transaction.origin === clientOrigin) {
    // opTypeは同じクライアントでしか取得できないため、注意
    const opType = txMetaUtil.getOpTypeFromTxMeta(transaction);
    if (opType === "add") return;
    if (opType === "remove") return;
  }

  console.log("delta", event.delta);

  event.delta.forEach((delta) => {
    if (delta.insert) {
      if (!Array.isArray(delta.insert)) {
        console.log("delta.insert should be an array, but was not.");
        return;
      }

      const inserts: string[] = delta.insert;
      inserts.forEach((key) => {
        // すでに追加されているオブジェクトは、追加しない
        // 並び替えの時は状況は変わるかも
        const object = objectMap.get(key);
        if (!object) return;
        receiver.receiveAddedObject(object);
      });

      index += delta.insert.length;
    } else if (delta.retain) {
      index += delta.retain;
    } else if (delta.delete) {
      const { canvas } = getFabricCanvas();
      const obj = canvas.getObjectByIndex(index);
      if (!obj?.id) return;
      receiver.receiveRemovedObject(obj.id);
    }
  });
};

const startDiffObserve = (
  yDocStore: YDocStoreType,
  {
    observeObjectMap,
    observeObjectOrder,
  }: {
    observeObjectMap: ObserveObjectMapFn;
    observeObjectOrder: ObserveObjectOrderFn;
  }
) => {
  const { objectMap, objectOrder } = yDocStore;

  objectMap.observe(observeObjectMap);
  objectOrder.observe(observeObjectOrder);

  const unobserve = () => {
    objectMap.unobserve(observeObjectMap);
    objectOrder.unobserve(observeObjectOrder);
  };

  return unobserve;
};

export const observeYDoc = (yDocStore: YDocStoreType) => {
  let unobserve: (() => void) | undefined;
  yDocStore.provider.on("synced", async () => {
    unobserve?.();

    showToast("synced");
    await receiver.clearAndReceiveAllObjects(yDocStore);
    showToast("cleared");

    unobserve = startDiffObserve(yDocStore, {
      observeObjectMap,
      observeObjectOrder,
    });
  });
};
