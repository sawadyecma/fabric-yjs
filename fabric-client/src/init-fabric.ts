import * as fabric from "fabric";

// FabricObjectにカスタムプロパティを定義
declare module "fabric" {
  interface FabricObject {
    id?: string;
  }

  interface SerializedObjectProps {
    id?: string;
  }
}
fabric.FabricObject.customProperties = ["id"];

export const initFabric = () => {
  const canvasEle = document.querySelector<HTMLCanvasElement>("#canvas");

  if (!canvasEle) {
    throw new Error("Canvas element not found");
  }

  const canvas = new fabric.Canvas(canvasEle, {
    backgroundColor: "#f0f0f0",
  });

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

  canvas.requestRenderAll();

  return canvas;
};
