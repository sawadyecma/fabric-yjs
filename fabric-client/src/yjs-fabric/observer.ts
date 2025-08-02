import { showToast } from "../dom/toast";
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
  // const { objectMap } = getYDocStore();
  console.log(event, transaction);
  event.keysChanged.forEach((_key) => {
    // TODO
  });
  return;
};

const observeObjectOrder: ObserveObjectOrderFn = (event, transaction) => {
  const { objectMap } = getYDocStore();
  let index: number = 0;
  const opType = txMetaUtil.getOpTypeFromTxMeta(transaction);

  if (transaction.origin === clientOrigin) {
    if (opType === "add") return;
  }

  event.delta.forEach((delta) => {
    if (delta.insert) {
      if (!Array.isArray(delta.insert)) {
        console.log("delta.insert should be an array, but was not.");
        return;
      }

      const inserts: string[] = delta.insert;
      inserts.forEach((key) => {
        const object = objectMap.get(key);
        if (!object) return;
        receiver.receiveAddedObject(object);
      });

      index += delta.insert.length;
    } else if (delta.retain) {
      index += delta.retain;
    } else if (delta.delete) {
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
