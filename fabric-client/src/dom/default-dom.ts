export const loadDefaultDoms = () => {
  const toolSelectorWrapper = document.querySelector<HTMLDivElement>(
    "#tool-selector-wrapper"
  )!;

  const _domStore = {
    toolSelectorWrapper,
  };

  domStore = _domStore;

  return _domStore;
};

let domStore: ReturnType<typeof loadDefaultDoms> | null = null;

export const getDefaultDom = () => {
  if (!domStore) {
    loadDefaultDoms();
  }

  return domStore;
};
