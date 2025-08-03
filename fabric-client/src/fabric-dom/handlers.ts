import { getAbsPropsFromActiveSelection } from "../fabric/active-selection";
import { CrossingEraserBrush } from "../fabric/CrossingEraserBrush";
import { getFabricCanvas } from "../fabric/init-fabric";
import { PencilBrush } from "fabric";
import * as fabric from "fabric";
import { getYDocStore } from "../yjs-fabric/createYDocStore";
import { sender } from "../yjs-fabric/sender";

const onPencilToolClick = () => {
  const { canvas } = getFabricCanvas();

  canvas.isDrawingMode = true;
  class MyPencilBrush extends PencilBrush {
    _finalizeAndAddPath() {
      super._finalizeAndAddPath();
      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      this.color = randomColor;
    }
  }
  const pencilBrush = new MyPencilBrush(canvas);
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
  canvas.removeActiveObjects();
};

const onUndo = () => {
  const { undoManager } = getYDocStore();
  undoManager.undo();
};

const onRedo = () => {
  const { undoManager } = getYDocStore();
  undoManager.redo();
};

export const toolSelectorHandlers = {
  onPencilToolClick,
  onEraserToolClick,
  onSelectToolClick,
  onColorChange,
  onDeleteActiveObjects,
};

export const redoUndoSectionHandlers = {
  onUndo,
  onRedo,
};

const onSendToFront = () => {
  const { canvas } = getFabricCanvas();
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects.length) return;

  activeObjects.forEach((obj) => {
    canvas.bringObjectToFront(obj);
    sender.sendBringObjectFront(obj);
  });
};

const onSendToBack = () => {
  throw new Error("Not implemented");
};

const onSendForward = () => {
  throw new Error("Not implemented");
};

const onSendBackward = () => {
  throw new Error("Not implemented");
};

export const zIndexSectionHandlers = {
  onSendToFront,
  onSendToBack,
  onSendForward,
  onSendBackward,
};
