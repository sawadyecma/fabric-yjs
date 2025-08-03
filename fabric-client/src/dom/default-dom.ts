export const loadDefaultDoms = () => {
  const toolSelectorWrapper = document.querySelector<HTMLDivElement>(
    "#tool-selector-wrapper"
  )!;

  const redoUndoSectionWrapper = document.querySelector<HTMLDivElement>(
    "#redo-undo-section-wrapper"
  )!;

  const zIndexSectionWrapper = document.querySelector<HTMLDivElement>(
    "#z-index-section-wrapper"
  )!;

  const _domStore = {
    toolSelectorWrapper,
    redoUndoSectionWrapper,
    zIndexSectionWrapper,
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
