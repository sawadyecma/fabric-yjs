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
  logTodoList,
  todoListStore,
  type TodoItem,
} from "./yjs-util";
import { showToast } from "./utils/toast";
import { generateUUID } from "./utils/uuid";

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

const createCheckboxDom = (completed: boolean) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  return checkbox;
};

const createDeleteButtonDom = () => {
  const button = document.createElement("button");
  button.textContent = "Delete";
  return button;
};

const createTodoItemDom = (item: TodoItem) => {
  const tr = document.createElement("tr");
  const titleTd = document.createElement("td");
  const checkTd = document.createElement("td");
  const actionTd = document.createElement("td");
  titleTd.textContent = item.title;
  checkTd.appendChild(createCheckboxDom(item.completed));
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

const main = async () => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const docId = params.get("docId");
  if (!docId) {
    const newParams = new URLSearchParams({ docId: "my-doc" });
    window.location.search = newParams.toString();
    return;
  }

  const { todoListStore, provider } = await connectWithDoc(docId);

  const startObserve = () => {
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
            if (item) {
              // showToast(`inserted item: ${item.title}`);
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

  provider.on("synced", () => {
    renderTodoList();
    showToast("synced");
    startObserve();
  });

  setInterval(() => {
    logTodoList();
  }, 1000);
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

addArrayItemButton.addEventListener("click", () => {
  const item = newArrayItemInput.value;
  const uuid = generateUUID();
  if (!todoListStore) return;
  todoListStore.itemMap.set(uuid, {
    id: uuid,
    title: item,
    completed: false,
  });
  todoListStore.order.push([uuid]);
});

const addManyObjectsButton = document.querySelector("#addManyObjectsButton")!;
addManyObjectsButton.addEventListener("click", () => {
  addManyObjects();
});

main();
