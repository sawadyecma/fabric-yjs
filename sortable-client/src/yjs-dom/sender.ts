import { clientOrigin } from "../utils/client";
import { generateUUID } from "../utils/uuid";
import { todoListStore, type TodoItem } from "../yjs-util";

const updateItemCompleted = (id: string, completed: boolean) => {
  if (!todoListStore) return;
  const item = todoListStore.itemMap.get(id);
  if (!item) {
    throw Error("item is not found");
  }

  const store = todoListStore;

  todoListStore.doc.transact(() => {
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
  });
};

const deleteItem = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;

  todoListStore.doc.transact(() => {
    store.itemMap.delete(id);
    store.order.delete(store.order.toArray().indexOf(id));
  });
};

const sendForward = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === 0) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  // 新しいアイテムを作成することで、同じObjectが一時的に存在できるようにする
  const newItem = {
    ...item,
    id: generateUUID(),
  };

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(index - 1, [newItem.id]);
    store.itemMap.set(newItem.id, newItem);
    store.itemMap.delete(id);
  });
};

const sendBackward = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  const newItem = {
    ...item,
    id: generateUUID(),
  };

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(index + 1, [newItem.id]);
    store.itemMap.set(newItem.id, newItem);
    store.itemMap.delete(id);
  });
};

const sendFront = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === 0) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  const newItem = {
    ...item,
    id: generateUUID(),
  };

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(0, [newItem.id]);
    store.itemMap.set(newItem.id, newItem);
    store.itemMap.delete(id);
  });
};

const sendBack = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;
  const newItem = {
    ...item,
    id: generateUUID(),
  };

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(store.order.length, [newItem.id]);
    store.itemMap.set(newItem.id, newItem);
    store.itemMap.delete(id);
  });
};

const sendBackward10 = (id: string) => {
  if (!todoListStore) return;
  const store = todoListStore;
  const index = store.order.toArray().indexOf(id);
  if (index === -1) return;
  if (index === store.order.length - 1) return;
  const item = store.itemMap.get(id);
  if (!item) return;

  const newItem = {
    ...item,
    id: generateUUID(),
  };

  const newIndex =
    index + 10 <= store.order.length ? index + 10 : store.order.length - 1;

  todoListStore.doc.transact(() => {
    store.order.delete(index);
    store.order.insert(newIndex, [newItem.id]);
    store.itemMap.set(newItem.id, newItem);
    store.itemMap.delete(id);
  });
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
