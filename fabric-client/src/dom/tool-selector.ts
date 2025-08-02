export const createToolSelector = ({
  onPencilToolClick,
  onEraserToolClick,
  onSelectToolClick,
}: {
  onPencilToolClick: () => void;
  onEraserToolClick: () => void;
  onSelectToolClick: () => void;
}) => {
  // ツールの種類
  // - ペン
  //   - ペンの太さ
  //   - ペンの色
  // - 交差消しゴム
  // - 選択
  // - オブジェクト
  //   - 図形
  //     - 図形の色
  //   - テキスト
  //     - テキストの色
  //     - テキストのサイズ

  const toolSelector = document.createElement("div");
  toolSelector.id = "tool-selector";
  const pencilTool = document.createElement("button");
  pencilTool.id = "pencil-tool";
  pencilTool.textContent = "Pencil";
  pencilTool.addEventListener("click", onPencilToolClick);
  toolSelector.appendChild(pencilTool);

  const eraserTool = document.createElement("button");
  eraserTool.id = "eraser-tool";
  eraserTool.textContent = "Eraser";
  eraserTool.addEventListener("click", onEraserToolClick);
  toolSelector.appendChild(eraserTool);

  const selectTool = document.createElement("button");
  selectTool.id = "select-tool";
  selectTool.textContent = "Select";
  selectTool.addEventListener("click", onSelectToolClick);
  toolSelector.appendChild(selectTool);

  return toolSelector;
};
