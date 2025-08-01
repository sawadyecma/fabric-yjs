import { generateUUID } from "../utils/uuid";
import { todoListStore } from "../yjs-util";
import { ORIGIN_OPERATIONS } from "./origin";

const addManyItems = () => {
  if (!todoListStore) return;
  const count = 100;

  const store = todoListStore;

  const startIndex = store.order.length;

  store.doc.transact(() => {
    for (let i = 0; i < count; i++) {
      const uuid = generateUUID();
      store.itemMap.set(uuid, {
        id: uuid,
        title: `item ${i + startIndex}`,
        completed: false,
      });
      store.order.push([uuid]);
    }
  }, ORIGIN_OPERATIONS.add);
};

const deleteAllItems = () => {
  if (!todoListStore) return;
  const store = todoListStore;
  store.doc.transact(() => {
    store.itemMap.clear();
    store.order.delete(0, store.order.length);
  }, ORIGIN_OPERATIONS.delete);
};

const deleteCompletedItems = () => {
  if (!todoListStore) return;
  const store = todoListStore;
  store.doc.transact(() => {
    store.itemMap.forEach((item) => {
      if (item.completed) {
        store.order.delete(store.order.toArray().indexOf(item.id));
        store.itemMap.delete(item.id);
      }
    });
  }, ORIGIN_OPERATIONS.delete);
};

export const loadDebuger = () => {
  const deleteAllItemsButton = document.querySelector("#deleteAllItems")!;
  deleteAllItemsButton.addEventListener("click", () => {
    deleteAllItems();
  });

  const addManyItemsButton = document.querySelector("#addManyItemsButton")!;
  addManyItemsButton.addEventListener("click", () => {
    addManyItems();
  });

  const deleteCompletedItemsButton = document.querySelector(
    "#deleteCompletedItems"
  )!;
  deleteCompletedItemsButton.addEventListener("click", () => {
    deleteCompletedItems();
  });
};
