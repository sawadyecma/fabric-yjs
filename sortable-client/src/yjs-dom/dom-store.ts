export const loadDoms = () => {
  const tBodyDom =
    document.querySelector<HTMLTableSectionElement>("#todo-list tbody")!;

  const addArrayItemButton = document.querySelector<HTMLButtonElement>(
    "#addArrayItemButton"
  )!;
  const newArrayItemInput =
    document.querySelector<HTMLInputElement>("#newArrayItemInput")!;

  const undoButton = document.querySelector<HTMLButtonElement>("#undoButton")!;
  const redoButton = document.querySelector<HTMLButtonElement>("#redoButton")!;

  DomStore = {
    tBodyDom,
    addArrayItemButton,
    newArrayItemInput,
    undoButton,
    redoButton,
  };

  return DomStore;
};

export let DomStore: {
  tBodyDom: HTMLTableSectionElement;
  addArrayItemButton: HTMLButtonElement;
  newArrayItemInput: HTMLInputElement;
  undoButton: HTMLButtonElement;
  redoButton: HTMLButtonElement;
} | null = null;
