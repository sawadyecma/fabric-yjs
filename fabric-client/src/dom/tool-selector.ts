export const createToolSelector = ({
  onPencilToolClick,
  onEraserToolClick,
  onSelectToolClick,
  onColorChange,
  onDeleteActiveObjects,
}: {
  onPencilToolClick: () => void;
  onEraserToolClick: () => void;
  onSelectToolClick: () => void;
  onColorChange: (color: string) => void;
  onDeleteActiveObjects: () => void;
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

  const selectTool = document.createElement("button");
  selectTool.id = "select-tool";
  selectTool.textContent = "Select";
  selectTool.addEventListener("click", onSelectToolClick);
  toolSelector.appendChild(selectTool);

  pencilTool.id = "pencil-tool";
  pencilTool.textContent = "Pencil";
  pencilTool.addEventListener("click", onPencilToolClick);
  toolSelector.appendChild(pencilTool);

  const eraserTool = document.createElement("button");
  eraserTool.id = "eraser-tool";
  eraserTool.textContent = "Eraser";
  eraserTool.addEventListener("click", onEraserToolClick);
  toolSelector.appendChild(eraserTool);

  type Tool = "pencil" | "eraser" | "select";
  let currentTool: Tool = "select";

  const selectToolOptionsDisplayStyle = (): string => {
    if (currentTool === "select") {
      return "block";
    }
    return "none";
  };

  const changeTool = (tool: Tool) => {
    currentTool = tool;
    if (currentTool === "select") {
      selectToolOptions.style.display = selectToolOptionsDisplayStyle();
    }
  };

  pencilTool.addEventListener("click", () => changeTool("pencil"));
  eraserTool.addEventListener("click", () => changeTool("eraser"));
  selectTool.addEventListener("click", () => changeTool("select"));

  const selectToolOptions = createSelectToolOptions({
    onColorChange,
    onDeleteActiveObjects,
  });
  selectToolOptions.style.display = selectToolOptions.style.display =
    selectToolOptionsDisplayStyle();
  toolSelector.appendChild(selectToolOptions);

  return toolSelector;
};

const createSelectToolOptions = ({
  onColorChange,
  onDeleteActiveObjects,
}: {
  onColorChange: (color: string) => void;
  onDeleteActiveObjects: () => void;
}) => {
  const selectToolOptions = document.createElement("div");
  selectToolOptions.id = "select-tool-options";

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.id = "color-input";
  colorInput.value = "#000000";

  let currentColor = "#000000";
  const isRgb = (color: string) => {
    const rgbRegex = /^#([0-9a-fA-F]{6})$/;
    return rgbRegex.test(color);
  };
  colorInput.addEventListener("change", (e) => {
    const color = (e.target as HTMLInputElement).value;
    if (!isRgb(color)) return;
    currentColor = color;
  });

  const changeColorButton = document.createElement("button");
  changeColorButton.id = "change-color-button";
  changeColorButton.textContent = "Change Color";
  changeColorButton.addEventListener("click", () => {
    onColorChange(currentColor);
  });

  const deleteActiveObjectsButton = document.createElement("button");
  deleteActiveObjectsButton.id = "delete-active-objects-button";
  deleteActiveObjectsButton.textContent = "Delete Active Objects";
  deleteActiveObjectsButton.addEventListener("click", () => {
    onDeleteActiveObjects();
  });

  selectToolOptions.appendChild(colorInput);
  selectToolOptions.appendChild(changeColorButton);
  selectToolOptions.appendChild(deleteActiveObjectsButton);

  return selectToolOptions;
};
