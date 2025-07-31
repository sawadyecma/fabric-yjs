import * as Y from "yjs";
import { createYjsProvider } from "@y-sweet/client";
import type { ClientToken } from "@y-sweet/sdk";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

type TodoList = TodoItem[];
type TodoListMap = {
  [key: string]: TodoItem;
};

export const todoListStore: {
  order: Y.Map<string> | null;
  itemMap: Y.Array<string> | null;
} = {
  order: null,
  itemMap: null,
};

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

  return {
    itemMap,
    order,
  };
};
