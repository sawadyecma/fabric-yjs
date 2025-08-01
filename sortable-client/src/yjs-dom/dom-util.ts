import type { TodoItem } from "../yjs-util";
import type {
  ItemActionHandlers,
  OnCompleteCheckboxClick,
  OnSendBackwardClick,
  OnSendForwardClick,
  OnSendFrontClick,
  OnSingleDeleteItemClick,
} from "./type";

const createTodoItemDom = (
  item: TodoItem,
  itemActionHandlers: ItemActionHandlers
) => {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  const titleTd = document.createElement("td");
  const checkTd = document.createElement("td");
  const actionTd = document.createElement("td");
  titleTd.textContent = item.title;

  const idSpan = document.createElement("span");
  idSpan.textContent = item.id;

  titleTd.append(idSpan);
  checkTd.appendChild(
    createCheckboxDom(
      item.completed,
      item.id,
      itemActionHandlers.onCompleteCheckboxClick
    )
  );
  actionTd.append(
    createDeleteButtonDom({
      id: item.id,
      onSingleDeleteItemClick: itemActionHandlers.onSingleDeleteItemClick,
    }),
    createSendFrontButtonDom({
      id: item.id,
      onSendFrontClick: itemActionHandlers.onSendFrontClick,
    }),
    createSendForwardButtonDom({
      id: item.id,
      onSendForwardClick: itemActionHandlers.onSendForwardClick,
    }),
    createSendBackwardButtonDom({
      id: item.id,
      onSendBackwardClick: itemActionHandlers.onSendBackwardClick,
    })
  );

  tr.append(titleTd, checkTd, actionTd);
  return tr;
};

const createCheckboxDom = (
  completed: boolean,
  id: string,
  onCompleteCheckboxClick: OnCompleteCheckboxClick
) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("click", (e) => {
    onCompleteCheckboxClick(e, id);
  });
  return checkbox;
};

const createDeleteButtonDom = ({
  id,
  onSingleDeleteItemClick,
}: {
  id: string;
  onSingleDeleteItemClick: OnSingleDeleteItemClick;
}) => {
  const button = document.createElement("button");
  button.textContent = "Delete";
  button.addEventListener("click", (e) => {
    onSingleDeleteItemClick(e, id);
  });
  return button;
};

const createSendForwardButtonDom = ({
  id,
  onSendForwardClick,
}: {
  id: string;
  onSendForwardClick: OnSendForwardClick;
}) => {
  const button = document.createElement("button");
  button.textContent = "↑1";
  button.addEventListener("click", (e) => {
    onSendForwardClick(e, id);
  });
  return button;
};

const createSendBackwardButtonDom = ({
  id,
  onSendBackwardClick,
}: {
  id: string;
  onSendBackwardClick: OnSendBackwardClick;
}) => {
  const button = document.createElement("button");
  button.textContent = "↓1";
  button.addEventListener("click", (e) => {
    onSendBackwardClick(e, id);
  });
  return button;
};

const createSendFrontButtonDom = ({
  id,
  onSendFrontClick,
}: {
  id: string;
  onSendFrontClick: OnSendFrontClick;
}) => {
  const button = document.createElement("button");
  button.textContent = "↑↑↑";
  button.addEventListener("click", (e) => {
    onSendFrontClick(e, id);
  });
  return button;
};

export const domUtil = {
  createTodoItemDom,
};
