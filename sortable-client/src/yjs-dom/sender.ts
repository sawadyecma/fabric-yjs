import { clientOrigin } from "../utils/client";
import { todoListStore, type TodoItem } from "../yjs-util";

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

const addItem = (item: TodoItem) => {
  if (!todoListStore) return;

  todoListStore.doc.transact(() => {
    if (!todoListStore) return;

    todoListStore.itemMap.set(item.id, item);

    // トランザクションの中で重い処理を行うと、どうなるか検証していた。ちゃんと同時に反映されていた。
    // heavyProcess();

    todoListStore.order.push([item.id]);
  });
};

export const sender = {
  updateItemCompleted,
  addItem,
};
