import { todoListStore, type TodoItem } from "../yjs-util";
import { clientOrigin } from "./origin";

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
  }, clientOrigin);
};

const addItem = (item: TodoItem) => {
  if (!todoListStore) return;

  const store = todoListStore;

  todoListStore.doc.transact(() => {
    store.itemMap.set(item.id, item);

    // トランザクションの中で重い処理を行うと、どうなるか検証していた。ちゃんと同時に反映されていた。
    // heavyProcess();

    store.order.push([item.id]);
  }, clientOrigin);
};

const deleteItem = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;

  todoListStore.doc.transact(() => {
    if (!store) return;

    store.itemMap.delete(id);
    store.order.delete(store.order.toArray().indexOf(id));
  }, clientOrigin);
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
  }, clientOrigin);
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
  }, clientOrigin);
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
  }, clientOrigin);
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
  }, clientOrigin);
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
  }, clientOrigin);
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
