import * as Y from "yjs";
import type { YEvent } from "yjs";
import * as fabric from "fabric";
import { ActiveSelection } from "fabric";
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
    if (opType === "bring-object-front") return;
  }

  const { objectMap } = getYDocStore();

  event.keysChanged.forEach((key) => {
    const object = objectMap.get(key);
    if (!object) return;
    receiver.receiveModifiedObject(object);
  });
  return;
};

const checkHasDeleteAndInsert = (delta: YEvent<Y.Array<string>>["delta"]) => {
  let hasInsert = false;
  let hasDelete = false;
  delta.forEach((delta) => {
    if (delta.insert) {
      hasInsert = true;
    }
    if (delta.delete) {
      hasDelete = true;
    }
  });
  return hasInsert && hasDelete;
};

const observeObjectOrder: ObserveObjectOrderFn = (event, transaction) => {
  console.log("delta", event.delta);
  if (transaction.origin === clientOrigin) {
    // 結局、fabric.js→Yjsの変換が綺麗にまとまる
    return;

    // opTypeは同じクライアントでしか取得できないため、注意
    const opType = txMetaUtil.getOpTypeFromTxMeta(transaction);
    if (opType === "add") return;
    if (opType === "remove") return;
    if (opType === "modify") return;
    if (opType === "bring-object-front") return;
    if (opType === "bring-object-back") return;
  }

  const hasDeleteAndInsert = checkHasDeleteAndInsert(event.delta);

  queueMicrotask(async () => {
    if (hasDeleteAndInsert) {
      const { canvas } = getFabricCanvas();
      const activeObjects = canvas.getActiveObjects();
      const activeIds = activeObjects
        .map((object) => object.id)
        .filter((v): v is string => Boolean(v));
      canvas.discardActiveObject();

      await receiver.clearAndReceiveAllObjects();

      if (activeIds.length > 0) {
        const actives = activeIds
          .map((id) => canvas.getObjectById(id))
          .filter((v): v is fabric.FabricObject => Boolean(v));
        const activeSelection = new ActiveSelection(actives);
        canvas.setActiveObject(activeSelection);
      }
      return;
    }
  });

  if (hasDeleteAndInsert) {
    return;
  }

  let index: number = 0;

  event.delta.forEach((delta) => {
    queueMicrotask(async () => {
      const { objectMap } = getYDocStore();

      if (delta.insert) {
        if (!Array.isArray(delta.insert)) {
          console.log("delta.insert should be an array, but was not.");
          return;
        }

        const inserts: string[] = delta.insert;
        for (const key of inserts) {
          // すでに追加されているオブジェクトは、追加しない
          // 並び替えの時は状況は変わるかも
          const object = objectMap.get(key);
          if (!object) return;
          await receiver.receiveAddedObject(object);
          index += 1;
        }
      } else if (delta.retain) {
        index += delta.retain;
      } else if (delta.delete) {
        const { canvas } = getFabricCanvas();
        const obj = canvas.getObjectByIndex(index);
        if (!obj?.id) return;
        receiver.receiveRemovedObject(obj.id);
      }
    });
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
  yDocStore.provider.on("synced", () => {
    unobserve?.();

    showToast("synced");
    queueMicrotask(async () => {
      await receiver.clearAndReceiveAllObjects();
      showToast("cleared");
      unobserve = startDiffObserve(yDocStore, {
        observeObjectMap,
        observeObjectOrder,
      });
    });
  });
};
