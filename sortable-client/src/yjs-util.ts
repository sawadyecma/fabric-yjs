import * as Y from "yjs";
import { createYjsProvider, YSweetProvider } from "@y-sweet/client";
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
  provider: YSweetProvider;
  doc: Y.Doc;
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
    provider,
    doc,
  };

  return todoListStore;
};

export const logTodoList = () => {
  if (!todoListStore) {
    console.log("todoListStore is empty");
    return;
  }

  console.log({ itemMap: mapToRecord(todoListStore.itemMap) });
  console.log({ order: todoListStore.order.toArray() });
};

export const logTodoListRegularly = (ms: number = 3000) => {
  setInterval(() => {
    logTodoList();
  }, ms);
};

const mapToRecord = (map: Y.Map<TodoItem>) => {
  const tmpMap: Record<string, TodoItem> = {};
  map.forEach((value, key) => {
    tmpMap[key] = value;
  });
  return tmpMap;
};
