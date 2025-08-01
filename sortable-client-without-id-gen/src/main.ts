import "./main.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Yjs Sortanble Client</h2>
    <button id="addManyItemsButton">Add Many Items</button>
    <button id="deleteAllItems">Delete All Items</button>
    <button id="deleteCompletedItems">Delete Completed Items</button>
    <hr/>
    <table id="todo-list">
      <thead>
        <tr>
          <th>Item</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div>
      <h3>Add item</h3>
      <input type="text" id="newArrayItemInput" placeholder="Item" />
      <button id="addArrayItemButton">Add Item</button>
    </div>
`;

import { CONFIG } from "./utils/config";
import { ApiClient } from "./utils/api-client";
import { createYDoc, logTodoListRegularly } from "./yjs-util";
import { showToast } from "./utils/toast";
import { receiver } from "./yjs-dom/receiver";
import { handlers, itemActionHandlers } from "./yjs-dom/handler";
import { domUtil } from "./yjs-dom/dom-util";
import { loadDoms } from "./yjs-dom/dom-store";
import { loadDebuger } from "./yjs-dom/debugger";
import { insertAt } from "./utils/array";
import { isSameOrigin } from "./yjs-dom/origin";

const connectWithDoc = async (docId: string) => {
  const apiClient = new ApiClient(CONFIG.SERVER_URL);

  const fetched = await apiClient.fetchYSweetToken(docId);
  if (!fetched.ok) {
    throw Error("failed to fetch clientToken");
  }
  const clientToken = fetched.data;
  console.log(clientToken);

  showToast("clientToken fetched");
  const store = createYDoc({
    clientToken,
  });
  showToast("connetced to y-sweet");

  return store;
};

const main = async () => {
  const DomStore = loadDoms();
  loadDebuger();

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const docId = params.get("docId");
  if (!docId) {
    const newParams = new URLSearchParams({ docId: "my-doc" });
    window.location.search = newParams.toString();
    return;
  }

  const todoListStore = await connectWithDoc(docId);

  const startObserve = () => {
    todoListStore.itemMap.observe((event) => {
      const origin = event.transaction.origin;

      console.log("origin", origin);

      event.keysChanged.forEach((key) => {
        const item = todoListStore.itemMap.get(key);
        if (!item) return;

        if (isSameOrigin(origin)) return;

        receiver.receiveUpdatedItem(key, item);
      });
    });

    let previousIds = todoListStore.order.toArray();

    todoListStore.order.observe((event) => {
      let index = 0;

      console.log("event.delta", event.delta);
      let insertedIndex: number | null = null;

      event.delta.forEach((delta) => {
        if (delta.insert) {
          if (!Array.isArray(delta.insert)) {
            // console.log(`delta.insert(${delta.insert}) is not array`);
            return;
          }

          const inserts: string[] = delta.insert;

          for (const insert of inserts) {
            const item = todoListStore.itemMap.get(insert);
            if (!item) return;

            const tBodyDom = DomStore.tBodyDom;
            const target = tBodyDom.children[index] ?? null;
            // nullなら末尾に追加される
            tBodyDom.insertBefore(
              domUtil.createTodoItemDom(item, itemActionHandlers),
              target
            );
            previousIds = insertAt(previousIds, index, insert);
            index += 1;
          }
          // 並べ替えの時に参照する用
          insertedIndex = index;
        } else if (delta.retain) {
          index += delta.retain;
        } else if (delta.delete) {
          const deletedIds = previousIds.slice(index, index + delta.delete);
          const deletedSet = new Set(deletedIds);

          deletedIds.forEach((id, _index) => {
            if (insertedIndex === null) {
              // 後方に動いていることになる
              receiver.singleDeleteItem(id);
            } else {
              // 前方に動いていることになる
              receiver.singleDeleteItem(id, false);
            }
          });
          previousIds = previousIds.filter((v) => !deletedSet.has(v));
        }
      });
      previousIds = todoListStore.order.toArray();
    });
  };

  todoListStore.provider.on("synced", () => {
    receiver.clearAndReceiveAllItems(itemActionHandlers);
    showToast("synced");
    startObserve();
  });

  logTodoListRegularly();

  const { addArrayItemButton, newArrayItemInput } = DomStore;

  addArrayItemButton.addEventListener("click", async (e) => {
    const item = newArrayItemInput.value;
    handlers.onAddItemClick(e, item);
  });
};

main();
