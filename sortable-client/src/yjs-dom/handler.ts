import { generateUUID } from "../utils/uuid";
import { sender } from "./sender";
import type { OnAddItemClick, OnCompleteCheckboxClick } from "./type";

const onCompleteCheckboxClick: OnCompleteCheckboxClick = (e, id) => {
  const target = e.target as HTMLInputElement;
  const completed = target.checked;
  sender.updateItemCompleted(id, completed);
};

const onAddItemClick: OnAddItemClick = (_e, title) => {
  const uuid = generateUUID();
  sender.addItem({
    id: uuid,
    title,
    completed: false,
  });
};

export const handlers = {
  onCompleteCheckboxClick,
  onAddItemClick,
};
