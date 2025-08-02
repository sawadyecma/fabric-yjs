import { ApiClient } from "./api-client";
import { CONFIG } from "./config";
import { initFabric } from "./fabric/init-fabric";
import { createYDoc } from "./yjs-fabric/createYDocStore";
import { observeYDoc } from "./yjs-fabric/observer";
import { sender } from "./yjs-fabric/sender";

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

  const yDocStore = createYDoc({
    clientToken,
  });

  observeYDoc(yDocStore);

  canvas.on("object:added", (event) => {
    const addedObject = event.target;
    // 新規追加ではないので、senderには送信しない
    if (addedObject.id) return;

    // ID発行
    addedObject.id = crypto.randomUUID();
    sender.sendAddedObject(addedObject);
  });
};

main();
