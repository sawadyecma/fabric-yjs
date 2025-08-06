import { getFabricCanvas } from "../fabric/init-fabric";
import { getYDocStore } from "./createYDocStore";
import * as fabric from "fabric";

const clearAndReceiveAllObjects = async () => {
  const { canvas } = getFabricCanvas();
  const { objectMap, objectOrder } = getYDocStore();

  canvas.removeAllObjects({ skipFire: true });

  const ids = objectOrder.toArray();
  const objects: fabric.FabricObject[] = ids
    .map((id) => objectMap.get(id))
    .filter((v): v is fabric.FabricObject => Boolean(v));

  const fabricObjects = (await fabric.util.enlivenObjects(objects)).filter(
    (v) => v instanceof fabric.FabricObject
  );

  canvas.addWithoutFire(...fabricObjects);
};

const receiveAddedObject = async (object: fabric.FabricObject) => {
  const { canvas } = getFabricCanvas();

  const asyncFn = async () => {
    const fabricObjects = await fabric.util.enlivenObjects([object]);
    const fabricObject = fabricObjects[0];
    if (!(fabricObject instanceof fabric.FabricObject)) {
      return;
    }

    canvas.addWithoutFire(fabricObject);
  };

  await asyncFn();
};

const receiveRemovedObject = (id: string) => {
  const { canvas } = getFabricCanvas();

  const object = canvas.getObjectById(id);
  if (object) {
    canvas.removeWithoutFire(object);
  }
};

const receiveModifiedObject = async (object: fabric.FabricObject) => {
  const { canvas } = getFabricCanvas();

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

  canvas.replace(fabricObject.id, fabricObject, {
    skipFire: true,
  });
};

export const receiver = {
  clearAndReceiveAllObjects,
  receiveAddedObject,
  receiveRemovedObject,
  receiveModifiedObject,
};
