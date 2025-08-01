import { todoListStore, type TodoItem } from "../yjs-util";
import { DomStore } from "./dom-store";
import { domUtil } from "./dom-util";
import type { ItemActionHandlers } from "./type";

const receiveUpdatedItem = (id: string, item: TodoItem) => {
  if (!DomStore) return;
  const { tBodyDom } = DomStore;
  const tr = tBodyDom.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;
  const checkbox = tr.querySelector(
    "input[type='checkbox']"
  ) as HTMLInputElement;
  checkbox.checked = item.completed;
};

const clearAndReceiveAllItems = (ItemActionHandlers: ItemActionHandlers) => {
  if (!todoListStore || !DomStore) return;
  const { tBodyDom } = DomStore;
  tBodyDom.replaceChildren();
  const ids = todoListStore.order.toArray();
  for (const id of ids) {
    const item = todoListStore.itemMap.get(id);
    if (item) {
      tBodyDom.appendChild(domUtil.createTodoItemDom(item, ItemActionHandlers));
    }
  }
};

const getTr = (
  tBodyDom: Exclude<typeof DomStore, null>["tBodyDom"],
  id: string,
  fromFirst: boolean = true
) => {
  if (fromFirst) {
    const tr = tBodyDom.querySelector<HTMLTableRowElement>(
      `tr[data-id="${id}"]`
    );
    return tr;
  } else {
    const trs = tBodyDom.querySelectorAll(`tr[data-id="${id}"]`);
    if (trs.length === 0) return null;
    return trs[trs.length - 1];
  }
};
const singleDeleteItem = (id: string, fromFirst: boolean = true) => {
  if (!DomStore) return;
  const { tBodyDom } = DomStore;

  if (!todoListStore) return;
  const tr = getTr(tBodyDom, id, fromFirst);

  if (!tr) return;
  tr.remove();
};

export const receiver = {
  receiveUpdatedItem,
  clearAndReceiveAllItems,
  singleDeleteItem,
};
