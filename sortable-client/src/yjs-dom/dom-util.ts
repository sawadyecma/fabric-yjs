import type { TodoItem } from "../yjs-util";
import type { OnCompleteCheckboxClick } from "./type";

const createTodoItemDom = (
  item: TodoItem,
  onCompleteCheckboxClick: OnCompleteCheckboxClick
) => {
  const tr = document.createElement("tr");
  tr.dataset.id = item.id;
  const titleTd = document.createElement("td");
  const checkTd = document.createElement("td");
  const actionTd = document.createElement("td");
  titleTd.textContent = item.title;
  checkTd.appendChild(
    createCheckboxDom(item.completed, item.id, onCompleteCheckboxClick)
  );
  actionTd.appendChild(createDeleteButtonDom());

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

const createDeleteButtonDom = () => {
  const button = document.createElement("button");
  button.textContent = "Delete";
  return button;
};

export const domUtil = {
  createTodoItemDom,
};
