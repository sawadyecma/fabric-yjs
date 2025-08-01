import { sender } from "./sender";
import type { OnCompleteCheckboxClick } from "./type";

export const onCompleteCheckboxClick: OnCompleteCheckboxClick = (e, id) => {
  const target = e.target as HTMLInputElement;
  const completed = target.checked;
  sender.updateItemCompleted(id, completed);
};
