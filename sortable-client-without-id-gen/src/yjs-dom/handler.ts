import { generateUUID } from "../utils/uuid";
import { sender } from "./sender";
import type {
  ItemActionHandlers,
  OnAddItemClick,
  OnCompleteCheckboxClick,
  OnSendBackClick,
  OnSendBackwardClick,
  OnSendForwardClick,
  OnSendFrontClick,
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

const onSendFrontClick: OnSendFrontClick = (_e, id) => {
  sender.sendFront(id);
};

const onSendBackClick: OnSendBackClick = (_e, id) => {
  sender.sendBack(id);
};

const onSendBackward10Click: OnSendBackwardClick = (_e, id) => {
  sender.sendBackward10(id);
};

export const itemActionHandlers: ItemActionHandlers = {
  onCompleteCheckboxClick,
  onSingleDeleteItemClick,
  onSendForwardClick,
  onSendBackwardClick,
  onSendFrontClick,
  onSendBackClick,
  onSendBackward10Click,
};

export const handlers = {
  onAddItemClick,
  itemActionHandlers,
};
