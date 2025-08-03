export const loadDefaultDoms = () => {
  const toolSelectorWrapper = document.querySelector<HTMLDivElement>(
    "#tool-selector-wrapper"
  )!;

  const redoUndoSectionWrapper = document.querySelector<HTMLDivElement>(
    "#redo-undo-section-wrapper"
  )!;

  const _domStore = {
    toolSelectorWrapper,
    redoUndoSectionWrapper,
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
