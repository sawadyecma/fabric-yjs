export const loadDoms = () => {
  const tBodyDom =
    document.querySelector<HTMLTableSectionElement>("#todo-list tbody")!;

  DomStore = {
    tBodyDom,
  };

  return DomStore;
};

export let DomStore: {
  tBodyDom: HTMLTableSectionElement;
} | null = null;
