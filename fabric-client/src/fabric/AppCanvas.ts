import * as fabric from "fabric";

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
