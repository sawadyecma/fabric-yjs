import * as Y from "yjs";
import { createYjsProvider, YSweetProvider } from "@y-sweet/client";
import type { ClientToken } from "@y-sweet/sdk";
import { clientOrigin } from "./utils/client";

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

export let todoListStore: {
  order: Y.Array<string>;
  itemMap: Y.Map<TodoItem>;
  provider: YSweetProvider;
  doc: Y.Doc;
  undoManager: Y.UndoManager;
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

  const undoManager = new Y.UndoManager(doc, {
    // これがないとclientOriginしているtransactionはundoできない
    trackedOrigins: new Set([clientOrigin]),
  });

  todoListStore = {
    itemMap,
    order,
    provider,
    doc,
    undoManager,
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

export const logTodoListRegularly = (ms: number = 10000) => {
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
