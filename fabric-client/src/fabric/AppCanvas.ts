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

  addWithoutFire(...objects: fabric.FabricObject[]) {
    objects.forEach((obj) => (obj.skipFire = true));
    this.add(...objects);
  }

  _onObjectAdded(obj: fabric.FabricObject): void {
    if (obj.skipFire) {
      if (obj.canvas && (obj.canvas as fabric.StaticCanvas) !== this) {
        console.warn(
          "Canvas is trying to add an object that belongs to a different canvas.\n" +
            "Resulting to default behavior: removing object from previous canvas and adding to new canvas"
        );
        obj.canvas.remove(obj);
      }
      obj._set("canvas", this);
      obj.setCoords();
      delete obj.skipFire;
      return;
    }
    super._onObjectAdded(obj);
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

  removeWithoutFire(...objects: fabric.FabricObject[]) {
    objects.forEach((obj) => (obj.skipFire = true));
    this.remove(...objects);
  }

  _onObjectRemoved(obj: fabric.FabricObject): void {
    if (obj.skipFire) {
      obj._set("canvas", undefined);
      delete obj.skipFire;
      return;
    }
    super._onObjectRemoved(obj);
  }

  insertAt(index: number, ...objects: fabric.FabricObject[]) {
    const ret = super.insertAt(index, ...objects);
    objects.forEach((object) => {
      if (object.id) {
        this.objectsMap.set(object.id, object);
      }
    });
    return ret;
  }

  insertWithoutFire(index: number, ...object: fabric.FabricObject[]) {
    object.forEach((obj) => (obj.skipFire = true));
    this.insertAt(index, ...object);
  }

  replace(
    id: string,
    object: fabric.FabricObject,
    opt: { skipFire: boolean } = { skipFire: false }
  ) {
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

    if (opt.skipFire) {
      this.removeWithoutFire(oldObj);
      this.insertWithoutFire(index, object);
    } else {
      this.remove(oldObj);
      this.insertAt(index, object);
    }
    this.objectsMap.set(id, object);
  }

  getObjectById(id: string): fabric.FabricObject | undefined {
    return this.objectsMap.get(id);
  }

  getObjectByIndex(index: number): fabric.FabricObject | undefined {
    return this.getObjects()[index] ?? undefined;
  }

  removeAllObjects(opt: { skipFire: boolean } = { skipFire: false }) {
    const objects = this.getObjects();
    if (opt.skipFire) {
      this.removeWithoutFire(...objects);
    } else {
      this.remove(...objects);
    }
    this.objectsMap.clear();
  }

  removeActiveObjects() {
    const actives = this.getActiveObjects();
    this.remove(...actives);
    this.discardActiveObject(); // これがないと表示から即消えてくれない
  }
}
