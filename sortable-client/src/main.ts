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
import {
  createYDoc,
  logTodoListRegularly,
  todoListStore,
  type TodoItem,
} from "./yjs-util";
import { showToast } from "./utils/toast";
import { generateUUID } from "./utils/uuid";
import { clientOrigin } from "./utils/client";

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

const tBodyDom =
  document.querySelector<HTMLTableSectionElement>("#todo-list tbody")!;

const onCompleteCheckboxClick = (e: PointerEvent, id: string) => {
  const target = e.target as HTMLInputElement;
  const completed = target.checked;
  updateItemCompleted(id, completed);
};

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

const createCheckboxDom = (completed: boolean, id: string) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("click", (e) => {
    onCompleteCheckboxClick(e, id);
  });
  return checkbox;
};

const createDeleteButtonDom = () => {
  const button = document.createElement("button");
  button.textContent = "Delete";
  return button;
};

const createTodoItemDom = (item: TodoItem) => {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  const titleTd = document.createElement("td");
  const checkTd = document.createElement("td");
  const actionTd = document.createElement("td");
  titleTd.textContent = item.title;
  checkTd.appendChild(createCheckboxDom(item.completed, item.id));
  actionTd.appendChild(createDeleteButtonDom());

  tr.append(titleTd, checkTd, actionTd);
  return tr;
};

const renderTodoList = () => {
  if (!todoListStore) return;
  const ids = todoListStore.order.toArray();
  for (const id of ids) {
    const item = todoListStore.itemMap.get(id);
    if (item) {
      tBodyDom.appendChild(createTodoItemDom(item));
    }
  }
};

const updateItemDom = (id: string, item: TodoItem) => {
  const tr = tBodyDom.querySelector(`tr[data-id="${item.id}"]`);
  if (!tr) return;
  const checkbox = tr.querySelector(
    "input[type='checkbox']"
  ) as HTMLInputElement;
  checkbox.checked = item.completed;
};

const main = async () => {
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
        updateItemDom(key, item);
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
              itemDoms.push(createTodoItemDom(item));
            }
          }
          tBodyDom.append(...itemDoms);
        } else if (delta.retain) {
          index += delta.retain;
        } else {
          console.log("delta is neither insert nor retain");
        }
      });
    });
  };

  todoListStore.provider.on("synced", () => {
    renderTodoList();
    showToast("synced");
    startObserve();
  });

  logTodoListRegularly();
};

const addArrayItemButton = document.querySelector("#addArrayItemButton")!;
const newArrayItemInput =
  document.querySelector<HTMLInputElement>("#newArrayItemInput")!;

const addManyObjects = () => {
  if (!todoListStore) return;
  const count = 100;

  for (let i = todoListStore.order.length; i < count; i++) {
    const uuid = generateUUID();
    todoListStore.itemMap.set(uuid, {
      id: uuid,
      title: `item ${i}`,
      completed: false,
    });
    todoListStore.order.push([uuid]);
  }
};

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

const addManyObjectsButton = document.querySelector("#addManyObjectsButton")!;
addManyObjectsButton.addEventListener("click", () => {
  addManyObjects();
});

main();
