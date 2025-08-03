import * as fabric from "fabric";
import { getFabricHandlerManager } from "../yjs-fabric/fabric-handler-manager";

export class AppCanvas extends fabric.Canvas {
  private objectsMap: Map<string, fabric.FabricObject> = new Map();

  add(...objects: fabric.FabricObject[]) {
    const ret = super.add(...objects);
    objects.forEach((object) => {
      if (object.id) {
        this.objectsMap.set(object.id, object);
      }
    });
    return ret;
  }

  remove(...objects: fabric.FabricObject[]) {
    const ret = super.remove(...objects);
    objects.forEach((object) => {
      if (object.id) {
        this.objectsMap.delete(object.id);
      }
    });
    return ret;
  }

  replace(id: string, object: fabric.FabricObject) {
    const oldObj = this.getObjectById(id);
    if (!oldObj) {
      console.warn("replace: oldObj not found", id);
      return;
    }
    const index = this.getObjects().indexOf(oldObj);
    if (index === -1) {
      console.warn("replace: index not found", id);
      return;
    }

    const fabricHandlerManager = getFabricHandlerManager();
    fabricHandlerManager.stopHandlers();

    this.remove(oldObj);
    this.insertAt(index, object);
    this.objectsMap.set(id, object);

    fabricHandlerManager.startHandlers();
  }

  getObjectById(id: string): fabric.FabricObject | undefined {
    return this.objectsMap.get(id);
  }

  getObjectByIndex(index: number): fabric.FabricObject | undefined {
    return this.getObjects()[index] ?? undefined;
  }

  removeAllObjects() {
    const objects = this.getObjects();
    this.remove(...objects);
    this.objectsMap.clear();
  }
}
