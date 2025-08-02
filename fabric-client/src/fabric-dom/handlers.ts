import { CrossingEraserBrush } from "../fabric/CrossingEraserBrush";
import { getFabricCanvas } from "../fabric/init-fabric";
import { PencilBrush } from "fabric";

const onPencilToolClick = () => {
  const { canvas } = getFabricCanvas();

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new PencilBrush(canvas);
};

const onEraserToolClick = () => {
  const { canvas } = getFabricCanvas();

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new CrossingEraserBrush(canvas);
};

const onSelectToolClick = () => {
  const { canvas } = getFabricCanvas();

  canvas.isDrawingMode = false;
};

export const toolSelectorHandlers = {
  onPencilToolClick,
  onEraserToolClick,
  onSelectToolClick,
};
