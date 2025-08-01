import { ApiClient } from "./api-client";
import { CONFIG } from "./config";
import { initFabric } from "./init-fabric";
import { createYDoc, updateFabricObject } from "./yjs-util";
import * as fabric from "fabric";

console.log("fabric-client main.ts loaded");

const main = async () => {
  const canvas = initFabric();

  const apiClient = new ApiClient(CONFIG.SERVER_URL);
  const fetched = await apiClient.fetchYSweetToken("fabric-doc-id");
  if (!fetched.ok) {
    console.error("Failed to fetch Y-Sweet token:", fetched.error);
    return;
  }
  const clientToken = fetched.data;

  const alreadyAddedObjects = new Set<string>();

  createYDoc({
    clientToken,
    onSharedMapChange: (key, value) => {
      if (alreadyAddedObjects.has(key)) {
        return;
      }
      const fn = async () => {
        console.log({ value });
        const fabricObjects = await fabric.util.enlivenObjects([value]);
        if (fabricObjects.length === 0) {
          console.warn("No enlivened objects found for key:", key);
          return;
        }
        const fabricObject = fabricObjects[0];
        if (fabricObject instanceof fabric.FabricObject) {
          canvas.add(fabricObject);
        } else {
          console.warn("Enlivened object is not a FabricObject:", fabricObject);
        }
      };

      fn();
    },
    onSharedArrayChange: () => {
      // console.log("Shared array changed:", event);
    },
  });

  canvas.on("object:added", (event) => {
    const addedObject = event.target;
    addedObject.id = addedObject.id || crypto.randomUUID();
    alreadyAddedObjects.add(addedObject.id);

    updateFabricObject(addedObject.id, addedObject.toObject());
  });
};

main();
