import * as Y from "yjs";
import { createYjsProvider } from "@y-sweet/client";
import type { ClientToken } from "@y-sweet/sdk";

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoList = TodoItem[];
type TodoListMap = {
  [key: string]: TodoItem;
};

export let todoListStore: {
  order: Y.Array<string>;
  itemMap: Y.Map<TodoItem>;
} | null = null;

export const createYDoc = ({ clientToken }: { clientToken: ClientToken }) => {
  // Create the Yjs doc and link it to the Y-Sweet server:
  const doc = new Y.Doc();
  const docId = clientToken.docId;

  // @ts-ignore
  const provider = createYjsProvider(doc, docId, () =>
    Promise.resolve(clientToken)
  );

  const itemMap = doc.getMap<TodoItem>("itemMap");
  const order = doc.getArray<string>("order");

  todoListStore = {
    itemMap,
    order,
  };

  return { todoListStore, provider };
};

export const logTodoList = () => {
  if (!todoListStore) {
    console.log("todoListStore is empty");
    return;
  }

  console.log({ itemMap: mapToRecord(todoListStore.itemMap) });
  console.log({ order: todoListStore.order.toArray() });
};

const mapToRecord = (map: Y.Map<TodoItem>) => {
  const tmpMap: Record<string, TodoItem> = {};
  map.forEach((value, key) => {
    tmpMap[key] = value;
  });
  return tmpMap;
};
