import { getFabricCanvas } from "../fabric/init-fabric";
import { getFabricHandlerManager } from "./fabric-handler-manager";
import type { YDocStoreType } from "./type";
import * as fabric from "fabric";

const clearAndReceiveAllObjects = async (yDocStore: YDocStoreType) => {
  const { canvas } = getFabricCanvas();
  const fabricHandlerManager = getFabricHandlerManager();
  const { objectMap, objectOrder } = yDocStore;

  fabricHandlerManager.stopHandlers();

  canvas.removeAllObjects();

  const ids = objectOrder.toArray();
  const objects: fabric.FabricObject[] = [];
  for (const id of ids) {
    const object = objectMap.get(id);
    if (object) {
      objects.push(object);
    }
  }
  const fabricObjects = (await fabric.util.enlivenObjects(
    objects
  )) as fabric.FabricObject[];

  canvas.add(...fabricObjects);

  fabricHandlerManager.startHandlers();
};

const receiveAddedObject = (object: fabric.FabricObject) => {
  const { canvas } = getFabricCanvas();
  console.log("receiveAddedObject", object);

  const asyncFn = async () => {
    const fabricObjects = await fabric.util.enlivenObjects([object]);
    const fabricObject = fabricObjects[0];
    if (!(fabricObject instanceof fabric.FabricObject)) {
      return;
    }

    canvas.add(fabricObject);
  };

  asyncFn();
};

const receiveRemovedObject = (id: string) => {
  const { canvas } = getFabricCanvas();
  const fabricHandlerManager = getFabricHandlerManager();
  fabricHandlerManager.stopHandlers();

  const object = canvas.getObjectById(id);
  if (object) {
    canvas.remove(object);
  }

  fabricHandlerManager.startHandlers();
};

const receiveModifiedObject = (object: fabric.FabricObject) => {
  const { canvas } = getFabricCanvas();

  const asyncFn = async () => {
    const fabricObjects = await fabric.util.enlivenObjects([object]);
    const fabricObject = fabricObjects[0];
    if (!(fabricObject instanceof fabric.FabricObject)) {
      return;
    }

    if (!fabricObject.id) {
      console.warn(
        "receiveModifiedObject: fabricObject.id not found",
        fabricObject
      );
      return;
    }

    canvas.replace(fabricObject.id, fabricObject);
  };

  asyncFn();
};

export const receiver = {
  clearAndReceiveAllObjects,
  receiveAddedObject,
  receiveRemovedObject,
  receiveModifiedObject,
};
