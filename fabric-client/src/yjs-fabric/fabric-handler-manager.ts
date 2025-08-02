import * as fabric from "fabric";
import { sender } from "./sender";

type ObjectAddedHandler = (event: { target: fabric.FabricObject }) => void;
type ObjectRemovedHandler = (event: { target: fabric.FabricObject }) => void;

export class FabricHanlderManager {
  private handlers: {
    objectAdded: ObjectAddedHandler;
    objectRemoved: ObjectRemovedHandler;
  };
  private canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    const objectAddedHandler: ObjectAddedHandler = (event) => {
      const addedObject = event.target;
      // 新規追加ではないので、senderには送信しない
      if (addedObject.id) return;

      // ID発行
      addedObject.id = crypto.randomUUID();
      sender.sendAddedObject(addedObject);
    };

    const objectRemovedHandler: ObjectRemovedHandler = (event) => {
      const removedObject = event.target;
      sender.sendRemovedObject(removedObject);
    };

    this.handlers = {
      objectAdded: objectAddedHandler,
      objectRemoved: objectRemovedHandler,
    };

    this.canvas = canvas;

    this.startHandlers();
  }

  startHandlers() {
    this.canvas.on("object:added", this.handlers.objectAdded);
    this.canvas.on("object:removed", this.handlers.objectRemoved);
  }

  stopHandlers() {
    this.canvas.off("object:added", this.handlers.objectAdded);
    this.canvas.off("object:removed", this.handlers.objectRemoved);
  }
}

let fabricHandlerManager: FabricHanlderManager | null = null;

export const initFabricHanlderManager = (canvas: fabric.Canvas) => {
  fabricHandlerManager = new FabricHanlderManager(canvas);
  return fabricHandlerManager;
};

export const getFabricHandlerManager = () => {
  if (!fabricHandlerManager) {
    throw new Error("FabricHandlerManager not initialized");
  }
  return fabricHandlerManager;
};
