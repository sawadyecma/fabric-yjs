import { generateUUID } from "../utils/uuid";
import { sender } from "./sender";
import type {
  OnAddItemClick,
  OnCompleteCheckboxClick,
  OnSingleDeleteItemClick,
} from "./type";

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

const onSingleDeleteItemClick: OnSingleDeleteItemClick = (_e, id) => {
  sender.deleteItem(id);
};

export const handlers = {
  onCompleteCheckboxClick,
  onAddItemClick,
  onSingleDeleteItemClick,
};
