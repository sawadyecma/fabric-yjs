import "./main.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Yjs Sortanble Client</h2>
    <button id="addManyObjectsButton">Add Many Objects</button>
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
import { createYDoc, logTodoListRegularly, todoListStore } from "./yjs-util";
import { showToast } from "./utils/toast";
import { generateUUID } from "./utils/uuid";
import { clientOrigin } from "./utils/client";
import { receiver } from "./yjs-dom/receiver";
import { onCompleteCheckboxClick } from "./yjs-dom/handler";
import { domUtil } from "./yjs-dom/dom-util";
import { loadDoms } from "./yjs-dom/dom-store";

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
      event.keysChanged.forEach((key) => {
        const item = todoListStore.itemMap.get(key);
        if (!item) return;
        if (event.transaction.origin === clientOrigin) {
          showToast(
            `updated item: ${key} but origin is here. so skipped dom update`
          );
          return;
        }
        receiver.receiveUpdatedItem(key, item);
      });
    });

    todoListStore.order.observe((event) => {
      event.delta.forEach((delta) => {
        let index = 0;
        if (delta.insert) {
          if (!Array.isArray(delta.insert)) {
            // console.log(`delta.insert(${delta.insert}) is not array`);
            return;
          }

          const inserts: string[] = delta.insert;
          const itemDoms: HTMLElement[] = [];
          for (const insert of inserts) {
            const item = todoListStore.itemMap.get(insert);
            showToast(`inserted item: ${insert}`);

            if (item) {
              itemDoms.push(
                domUtil.createTodoItemDom(item, onCompleteCheckboxClick)
              );
            }
          }

          DomStore.tBodyDom.append(...itemDoms);
        } else if (delta.retain) {
          index += delta.retain;
        } else {
          console.log("delta is neither insert nor retain");
        }
      });
    });
  };

  todoListStore.provider.on("synced", () => {
    receiver.clearAndReceiveAllItems({
      onCompleteCheckboxClick,
    });
    showToast("synced");
    startObserve();
  });

  logTodoListRegularly();
};

const addArrayItemButton = document.querySelector("#addArrayItemButton")!;
const newArrayItemInput =
  document.querySelector<HTMLInputElement>("#newArrayItemInput")!;

addArrayItemButton.addEventListener("click", async () => {
  const item = newArrayItemInput.value;
  const uuid = generateUUID();
  if (!todoListStore) return;

  todoListStore.doc.transact(() => {
    if (!todoListStore) return;

    todoListStore.itemMap.set(uuid, {
      id: uuid,
      title: item,
      completed: false,
    });

    // トランザクションの中で重い処理を行うと、どうなるか検証していた。ちゃんと同時に反映されていた。
    // heavyProcess();

    todoListStore.order.push([uuid]);
  });
});

main();
