import { generateUUID } from "../utils/uuid";
import { sender } from "./sender";
import type {
  ItemActionHandlers,
  OnAddItemClick,
  OnCompleteCheckboxClick,
  OnSendBackwardClick,
  OnSendForwardClick,
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

const onSendForwardClick: OnSendForwardClick = (_e, id) => {
  sender.sendForward(id);
};

const onSendBackwardClick: OnSendBackwardClick = (_e, id) => {
  sender.sendBackward(id);
};

export const itemActionHandlers: ItemActionHandlers = {
  onCompleteCheckboxClick,
  onSingleDeleteItemClick,
  onSendForwardClick,
  onSendBackwardClick,
};

export const handlers = {
  onAddItemClick,
  itemActionHandlers,
};
