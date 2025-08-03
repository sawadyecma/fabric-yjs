import { getFabricCanvas } from "../fabric/init-fabric";
import { getYDocStore } from "./createYDocStore";
import { getFabricHandlerManager } from "./fabric-handler-manager";
import * as fabric from "fabric";

const clearAndReceiveAllObjects = async () => {
  const { canvas } = getFabricCanvas();
  const fabricHandlerManager = getFabricHandlerManager();
  const { objectMap, objectOrder } = getYDocStore();

  fabricHandlerManager.stopHandlers();

  canvas.removeAllObjects();

  const ids = objectOrder.toArray();
  const objects: fabric.FabricObject[] = ids
    .map((id) => objectMap.get(id))
    .filter((v): v is fabric.FabricObject => Boolean(v));

  const fabricObjects = (await fabric.util.enlivenObjects(objects)).filter(
    (v) => v instanceof fabric.FabricObject
  );

  canvas.add(...fabricObjects);

  fabricHandlerManager.startHandlers();
};

const receiveAddedObject = async (object: fabric.FabricObject) => {
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

  await asyncFn();
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

const receiveModifiedObject = async (object: fabric.FabricObject) => {
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

  await asyncFn();
};

export const receiver = {
  clearAndReceiveAllObjects,
  receiveAddedObject,
  receiveRemovedObject,
  receiveModifiedObject,
};
