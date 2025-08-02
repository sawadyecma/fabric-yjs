import { ApiClient } from "./api-client";
import { CONFIG } from "./config";
import { loadDefaultDoms } from "./dom/default-dom";
import { createToolSelector } from "./dom/tool-selector";
import { toolSelectorHandlers } from "./fabric-dom/handlers";
import { initFabric } from "./fabric/init-fabric";
import { createYDoc } from "./yjs-fabric/createYDocStore";
import { initFabricHanlderManager } from "./yjs-fabric/fabric-handler-manager";
import { observeYDoc } from "./yjs-fabric/observer";

console.log("fabric-client main.ts loaded");

const main = async () => {
  const domStore = loadDefaultDoms();

  const canvas = initFabric();
  initFabricHanlderManager(canvas);

  domStore.toolSelectorWrapper.appendChild(
    createToolSelector(toolSelectorHandlers)
  );

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
};

main();
