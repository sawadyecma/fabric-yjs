import { ApiClient } from "./api-client";
import { CONFIG } from "./config";
import { loadDefaultDoms } from "./dom/default-dom";
import { createRedoUndoSection } from "./dom/redo-undo-section";
import { createToolSelector } from "./dom/tool-selector";
import { createZIndexSection } from "./dom/z-index-section";
import {
  redoUndoSectionHandlers,
  toolSelectorHandlers,
  zIndexSectionHandlers,
} from "./fabric-dom/handlers";
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

  domStore.redoUndoSectionWrapper.appendChild(
    createRedoUndoSection(redoUndoSectionHandlers)
  );

  domStore.zIndexSectionWrapper.appendChild(
    createZIndexSection(zIndexSectionHandlers)
  );

  const apiClient = new ApiClient(CONFIG.SERVER_URL);
  const fetched = await apiClient.fetchYSweetToken("fabric-doc-id3");
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
