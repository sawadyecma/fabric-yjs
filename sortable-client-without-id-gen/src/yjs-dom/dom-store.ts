export const loadDoms = () => {
  const tBodyDom =
    document.querySelector<HTMLTableSectionElement>("#todo-list tbody")!;

  const addArrayItemButton = document.querySelector<HTMLButtonElement>(
    "#addArrayItemButton"
  )!;
  const newArrayItemInput =
    document.querySelector<HTMLInputElement>("#newArrayItemInput")!;

  DomStore = {
    tBodyDom,
    addArrayItemButton,
    newArrayItemInput,
  };

  return DomStore;
};

export let DomStore: {
  tBodyDom: HTMLTableSectionElement;
  addArrayItemButton: HTMLButtonElement;
  newArrayItemInput: HTMLInputElement;
} | null = null;
