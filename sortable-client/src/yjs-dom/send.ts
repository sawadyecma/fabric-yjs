import { clientOrigin } from "../utils/client";
import { todoListStore } from "../yjs-util";

const updateItemCompleted = (id: string, completed: boolean) => {
  if (!todoListStore) return;
  const item = todoListStore.itemMap.get(id);
  if (!item) {
    throw Error("item is not found");
  }

  todoListStore.doc.transact(() => {
    if (!todoListStore) return;

    todoListStore.itemMap.set(id, {
      ...item,
      completed,
    });
  }, clientOrigin);
};

export const sender = {
  updateItemCompleted,
};
