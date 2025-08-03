import { getAbsPropsFromActiveSelection } from "../fabric/active-selection";
import { CrossingEraserBrush } from "../fabric/CrossingEraserBrush";
import { getFabricCanvas } from "../fabric/init-fabric";
import { PencilBrush } from "fabric";
import * as fabric from "fabric";

const onPencilToolClick = () => {
  const { canvas } = getFabricCanvas();

  canvas.isDrawingMode = true;
  const pencilBrush = new PencilBrush(canvas);
  pencilBrush.width = 10;
  canvas.freeDrawingBrush = pencilBrush;
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

const onColorChange = async (color: string) => {
  const { canvas } = getFabricCanvas();
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const changeColor = (
    obj: fabric.FabricObject,
    opt: { withTrigger: boolean } = { withTrigger: true }
  ) => {
    if (obj instanceof fabric.Path) {
      obj.set("stroke", color);
    } else {
      obj.set("fill", color);
    }
    if (opt.withTrigger) {
      canvas.fire("object:modified", { target: obj });
    }
  };

  if (activeObject instanceof fabric.ActiveSelection) {
    const selectionMatrix = activeObject.calcTransformMatrix();
    const objects = activeObject.getObjects();

    for (const obj of objects) {
      changeColor(obj, { withTrigger: false });

      const cloned = await obj.clone();
      const absProps = getAbsPropsFromActiveSelection(obj, selectionMatrix);
      cloned.set(absProps);
      // clonedはcanvasに追加しない
      canvas.fire("object:modified", { target: cloned });
    }
  } else {
    changeColor(activeObject);
  }
  canvas.requestRenderAll();
};

const onDeleteActiveObjects = () => {
  const { canvas } = getFabricCanvas();
  const actives = canvas.getActiveObjects();
  canvas.remove(...actives);
  canvas.discardActiveObject(); // これがないと表示から即消えてくれない
};

export const toolSelectorHandlers = {
  onPencilToolClick,
  onEraserToolClick,
  onSelectToolClick,
  onColorChange,
  onDeleteActiveObjects,
};
