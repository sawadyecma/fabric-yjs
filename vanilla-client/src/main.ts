import "./main.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Yjs Vanilla Client</h1>
    <p>Connect to your Yjs server and start collaborating!</p>
    <input type="text" id="docId" placeholder="Document ID" value="my-doc" />
    <button id="connect">Connect to Yjs Server</button>
    <div id="status"></div>
    <div id="y-sweet-token"></div>
    <hr/>
    <button id="getOrCreateProvider">get or create provider</button>
    <hr/>
    <h2>Shared Map</h2>
    <table id="shared-map">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div>
      <h3>add key-value pair to shared map</h3>
      <input type="text" id="key" placeholder="Key" />
      <input type="text" id="value" placeholder="Value" />
      <button id="updateThing">Update Thing</button>
    </div>
    <hr/>
    <h2>Shared Array</h2>
    <table id="shared-array">
      <thead>
        <tr>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div>
      <h3>Add item to shared array</h3>
      <input type="text" id="arrayItem" placeholder="Item" />
      <button id="addArrayItem">Add Item</button>
    </div>
    <div>
      <button id="deleteAllArrayItems">Delete All Items</button>
    </div>
`;

import { type ClientToken } from "@y-sweet/sdk";
import { CONFIG } from "./config";
import { ApiClient } from "./api-client";

let store:
  | {
      clientToken: ClientToken;
      status: "token-fetched";
    }
  | {
      clientToken: ClientToken;
      status: "connect-with-y-sweet";
    }
  | null = null;

const apiClient = new ApiClient(CONFIG.SERVER_URL);
const sharedMapTableBody =
  document.querySelector<HTMLTableSectionElement>("#shared-map tbody")!;

export const sharedArrayTableBody =
  document.querySelector<HTMLTableSectionElement>("#shared-array tbody")!;

document
  .querySelector<HTMLButtonElement>("#connect")!
  .addEventListener("click", async () => {
    const statusDiv = document.querySelector<HTMLDivElement>("#status")!;
    statusDiv.textContent = "Connecting to Yjs server...";
    const docIdInput = document.querySelector<HTMLInputElement>("#docId")!;
    const fetched = await apiClient.fetchYSweetToken(docIdInput.value);

    if (fetched.ok) {
      statusDiv.textContent = "Connected to Yjs server!";
      const ySweetTokenDiv =
        document.querySelector<HTMLDivElement>("#y-sweet-token")!;
      store = {
        status: "token-fetched",
        clientToken: fetched.data,
      };
      ySweetTokenDiv.innerHTML = `<p>Client Token: ${JSON.stringify(
        store.clientToken,
        null,
        2
      )}</p>`;
    } else {
      statusDiv.textContent = `Error: ${fetched.error}`;
      console.error("Failed to fetch Y-Sweet token:", fetched.error);
      store = null;
    }
  });

import { createYDoc, docStore, pushArrayItem, updateThing } from "./yjs-util";

document
  .querySelector<HTMLButtonElement>("#getOrCreateProvider")!
  .addEventListener("click", () => {
    if (!store) {
      console.warn("Store is not initialized. Please connect first.");
      return;
    }
    const { clientToken } = store;

    const appendKeyValue = (key: string, value: any) => {
      const id = `key-${key}`;
      const existingRow = document.querySelector<HTMLTableRowElement>(`#${id}`);
      if (existingRow) {
        existingRow.querySelector("td:nth-child(2)")!.textContent =
          JSON.stringify(value);
        return;
      }

      const newRow = document.createElement("tr");
      newRow.id = id;

      const keyCell = document.createElement("td");
      keyCell.textContent = key;
      newRow.appendChild(keyCell);

      const valueCell = document.createElement("td");
      valueCell.textContent = JSON.stringify(value);
      newRow.appendChild(valueCell);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteKeyValue(key);
      });
      actionsCell.appendChild(deleteButton);
      newRow.appendChild(actionsCell);

      sharedMapTableBody.appendChild(newRow);
    };

    const deleteKeyValue = (key: string) => {
      const id = `key-${key}`;
      const existingRow = document.querySelector<HTMLTableRowElement>(`#${id}`);
      if (existingRow) {
        existingRow.remove();
      }
    };

    createYDoc({
      clientToken,
      onSharedMapChange: (key, value) => {
        if (!value) {
          deleteKeyValue(key);
          return;
        }
        appendKeyValue(key, value);
      },
      onSharedArrayChange: () => {
        sharedArrayTableBody.innerHTML = ""; // Clear the table for simplicity
        const items = docStore.sharedArray?.toArray() || [];
        items.forEach((item, index) => {
          const newRow = document.createElement("tr");
          newRow.draggable = true;
          newRow.addEventListener("dragover", (event) => {
            // ドロップできるように既定の動作を停止
            event.preventDefault();
          });
          newRow.addEventListener("drop", (event) => {
            const rect = newRow.getBoundingClientRect();
            const { clientY } = event;
            if (clientY < rect.top + rect.height / 2) {
              console.log("Dropped on the top half");
            } else {
              console.log("Dropped on the bottom half");
            }
          });
          const itemTd = document.createElement("td");
          itemTd.textContent = item;
          newRow.appendChild(itemTd);
          const actionTd = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => {
            docStore.sharedArray?.delete(index);
          });
          actionTd.appendChild(deleteButton);
          newRow.appendChild(actionTd);

          sharedArrayTableBody.appendChild(newRow);
        });
      },
    });

    const keys = docStore.sharedMap?.keys();
    if (!keys) {
      console.warn("Shared map is not initialized.");
      return;
    }

    const keyValues: Record<string, any> = {};

    while (true) {
      const key = keys.next();
      if (key.done) break;
      keyValues[key.value] = docStore.sharedMap?.get(key.value);
    }

    Object.entries(keyValues).forEach(([key, value]) => {
      appendKeyValue(key, value);
    });

    store = {
      ...store,
      status: "connect-with-y-sweet",
    };
  });

document
  .querySelector<HTMLButtonElement>("#updateThing")!
  .addEventListener("click", () => {
    const keyInput = document.querySelector<HTMLInputElement>("#key")!;
    const valueInput = document.querySelector<HTMLInputElement>("#value")!;
    const key = keyInput.value;
    const value = valueInput.value;
    if (!key || !value) {
      console.warn("Key and value must be provided.");
      return;
    }
    updateThing(key, value);
    keyInput.value = "";
    valueInput.value = "";
  });

document
  .querySelector<HTMLButtonElement>("#addArrayItem")!
  .addEventListener("click", () => {
    const arrayItemInput =
      document.querySelector<HTMLInputElement>("#arrayItem")!;
    const item = arrayItemInput.value;
    if (!item) {
      console.warn("Item must be provided.");
      return;
    }
    pushArrayItem(item);
    arrayItemInput.value = "";
  });

document
  .querySelector<HTMLButtonElement>("#deleteAllArrayItems")!
  .addEventListener("click", () => {
    if (!docStore.sharedArray) {
      console.warn("Shared array is not initialized.");
      return;
    }
    const array = docStore.sharedArray.toArray();
    // WARN: This will delete all items in the shared array
    // usually it does not delete all items in the shared array
    array.forEach((_, index) => {
      docStore.sharedArray?.delete(index);
    });
  });
