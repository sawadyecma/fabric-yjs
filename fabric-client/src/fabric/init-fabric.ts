import * as fabric from "fabric";
import { AppCanvas } from "./AppCanvas";

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

  const canvas = new AppCanvas(canvasEle, {
    backgroundColor: "#f0f0f0",
  });

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

  canvas.requestRenderAll();

  fabricCanvas = canvas;

  return canvas;
};

let fabricCanvas: AppCanvas | null = null;

export const getFabricCanvas = () => {
  if (!fabricCanvas) {
    throw new Error("Fabric canvas not found");
  }
  return { canvas: fabricCanvas };
};
