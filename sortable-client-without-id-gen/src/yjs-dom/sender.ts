import { todoListStore, type TodoItem } from "../yjs-util";
import { ORIGIN_OPERATIONS } from "./origin";

const updateItemCompleted = (id: string, completed: boolean) => {
  if (!todoListStore) return;
  const item = todoListStore.itemMap.get(id);
  if (!item) {
    throw Error("item is not found");
  }

  const store = todoListStore;

  todoListStore.doc.transact(() => {
    if (!store) return;

    store.itemMap.set(id, {
      ...item,
      completed,
    });
  }, ORIGIN_OPERATIONS.update);
};

const addItem = (item: TodoItem) => {
  if (!todoListStore) return;

  const store = todoListStore;

  todoListStore.doc.transact(() => {
    store.itemMap.set(item.id, item);

    // トランザクションの中で重い処理を行うと、どうなるか検証していた。ちゃんと同時に反映されていた。
    // heavyProcess();

    store.order.push([item.id]);
  }, ORIGIN_OPERATIONS.add);
};

const deleteItem = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;

  todoListStore.doc.transact(() => {
    if (!store) return;

    store.itemMap.delete(id);
    store.order.delete(store.order.toArray().indexOf(id));
  }, ORIGIN_OPERATIONS.delete);
};

const sendForward = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === 0) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(index - 1, [item.id]);
  }, ORIGIN_OPERATIONS.moveForward);
};

const sendBackward = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(index + 1, [item.id]);
  }, ORIGIN_OPERATIONS.moveBackward);
};

const sendFront = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === 0) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(0, [item.id]);
  }, ORIGIN_OPERATIONS.moveBackward);
};

const sendBack = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(store.order.length, [item.id]);
  }, ORIGIN_OPERATIONS.moveBackward);
};

const sendBackward10 = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  const newIndex =
    index + 10 <= store.order.length ? index + 10 : store.order.length - 1;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(newIndex, [item.id]);
  }, ORIGIN_OPERATIONS.moveBackward);
};

export const sender = {
  updateItemCompleted,
  addItem,
  deleteItem,
  sendForward,
  sendBackward,
  sendFront,
  sendBack,
  sendBackward10,
};
