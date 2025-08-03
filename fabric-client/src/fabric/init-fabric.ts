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
    // ドラッグ選択でオブジェクトを選ぶときに「選択範囲にどれだけ入っているか」を判定する基準を制御するためのプロパティ
    selectionFullyContained: true,
  });

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
