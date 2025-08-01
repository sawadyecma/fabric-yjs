export type OnCompleteCheckboxClick = (e: PointerEvent, id: string) => void;
export type OnAddItemClick = (e: Event, title: string) => void;
export type OnSingleDeleteItemClick = (e: Event, id: string) => void;
export type OnSendForwardClick = (e: Event, id: string) => void;
export type OnSendBackwardClick = (e: Event, id: string) => void;
export type OnSendFrontClick = (e: Event, id: string) => void;
export type OnSendBackClick = (e: Event, id: string) => void;
export type ItemActionHandlers = {
  onCompleteCheckboxClick: OnCompleteCheckboxClick;
  onSingleDeleteItemClick: OnSingleDeleteItemClick;
  onSendForwardClick: OnSendForwardClick;
  onSendBackwardClick: OnSendBackwardClick;
};
