export const createRedoUndoSection = ({
  onUndo,
  onRedo,
}: {
  onUndo: () => void;
  onRedo: () => void;
}) => {
  const redoUndoSection = document.createElement("div");
  redoUndoSection.id = "redo-undo-section";

  const undoButton = document.createElement("button");
  undoButton.id = "undo-button";
  undoButton.textContent = "Undo";
  undoButton.addEventListener("click", onUndo);

  const redoButton = document.createElement("button");
  redoButton.id = "redo-button";
  redoButton.textContent = "Redo";
  redoButton.addEventListener("click", onRedo);

  redoUndoSection.appendChild(undoButton);
  redoUndoSection.appendChild(redoButton);
  return redoUndoSection;
};
