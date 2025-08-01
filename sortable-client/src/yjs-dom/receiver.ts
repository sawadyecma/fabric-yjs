import { todoListStore, type TodoItem } from "../yjs-util";
import { DomStore } from "./dom-store";
import { domUtil } from "./dom-util";
import type { OnCompleteCheckboxClick, OnSingleDeleteItemClick } from "./type";

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

const clearAndReceiveAllItems = ({
  onCompleteCheckboxClick,
  onSingleDeleteItemClick,
}: {
  onCompleteCheckboxClick: OnCompleteCheckboxClick;
  onSingleDeleteItemClick: OnSingleDeleteItemClick;
}) => {
  if (!todoListStore || !DomStore) return;
  const { tBodyDom } = DomStore;
  tBodyDom.replaceChildren();
  const ids = todoListStore.order.toArray();
  for (const id of ids) {
    const item = todoListStore.itemMap.get(id);
    if (item) {
      tBodyDom.appendChild(
        domUtil.createTodoItemDom(item, {
          onCompleteCheckboxClick,
          onSingleDeleteItemClick,
        })
      );
    }
  }
};

const singleDeleteItem = (id: string) => {
  if (!DomStore) return;
  const { tBodyDom } = DomStore;

  if (!todoListStore) return;

  const tr = tBodyDom.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;
  tr.remove();
};

export const receiver = {
  receiveUpdatedItem,
  clearAndReceiveAllItems,
  singleDeleteItem,
};
