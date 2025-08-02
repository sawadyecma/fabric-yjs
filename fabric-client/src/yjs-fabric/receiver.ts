import { getFabricCanvas } from "../fabric/init-fabric";
import type { YDocStoreType } from "./type";
import * as fabric from "fabric";

const clearAndReceiveAllObjects = async (yDocStore: YDocStoreType) => {
  const { canvas } = getFabricCanvas();
  const { objectMap, objectOrder } = yDocStore;
  // canvas.clear();
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
};

const receiveAddedObject = (object: fabric.FabricObject) => {
  const { canvas } = getFabricCanvas();

  const asyncFn = async () => {
    const fabricObjects = await fabric.util.enlivenObjects([object]);
    const fabricObject = fabricObjects[0];
    if (!(fabricObject instanceof fabric.FabricObject)) {
      console.warn("Enlivened object is not a FabricObject:", fabricObject);
      return;
    }

    canvas.add(fabricObject);
  };

  asyncFn();
};

export const receiver = {
  clearAndReceiveAllObjects,
  receiveAddedObject,
};
