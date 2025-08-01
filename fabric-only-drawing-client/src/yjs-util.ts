import * as Y from "yjs";
import { createYjsProvider } from "@y-sweet/client";
import type { ClientToken } from "@y-sweet/sdk";
import * as fabric from "fabric";

export const docStore: {
  sharedMap: Y.Map<fabric.FabricObject> | null;
  sharedArray?: Y.Array<string> | null;
} = {
  sharedMap: null,
  sharedArray: null,
};

export const createYDoc = ({
  clientToken,
  onSharedMapChange,
  onSharedArrayChange,
}: {
  clientToken: ClientToken;
  onSharedMapChange: (key: string, value: any) => void;
  onSharedArrayChange: (event: Y.YArrayEvent<any>) => void;
}) => {
  // Create the Yjs doc and link it to the Y-Sweet server:
  const doc = new Y.Doc();
  const docId = clientToken.docId;

  // @ts-ignore
  const provider = createYjsProvider(doc, docId, () =>
    Promise.resolve(clientToken)
  );

  const mySharedMap = doc.getMap<fabric.FabricObject>("thing");
  docStore.sharedMap = mySharedMap;

  // Update your UI based on `mySharedMap` changes like this, for example:
  mySharedMap.observe((event) => {
    event.keysChanged.forEach((key) => {
      onSharedMapChange(key, mySharedMap.get(key));
    });
  });

  const mySharedArray = doc.getArray<string>("my-shared-array");
  docStore.sharedArray = mySharedArray;

  provider.on("sync", () => {
    if (mySharedArray.length === 0) {
      for (let i = 0; i < 1000; i++) {
        pushArrayItem(`Item ${i + 1}`);
      }
    }
  });

  mySharedArray.observe((event) => {
    onSharedArrayChange(event);
  });
};

export const updateFabricObject = (key: string, value: fabric.FabricObject) => {
  if (!docStore.sharedMap) {
    console.warn("Shared map is not initialized.");
    return;
  }
  docStore.sharedMap.set(key, value);
};

export const deleteFabricObject = (key: string) => {
  if (!docStore.sharedMap) {
    console.warn("Shared map is not initialized.");
    return;
  }

  docStore.sharedMap.delete(key);
};

export const pushArrayItem = (item: string) => {
  if (!docStore.sharedArray) {
    console.warn("Shared array is not initialized.");
    return;
  }

  docStore.sharedArray.push([item]);
};
