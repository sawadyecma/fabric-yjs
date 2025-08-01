import { generateUUID } from "../utils/uuid";
import { todoListStore } from "../yjs-util";

export const addManyObjects = () => {
  if (!todoListStore) return;
  const count = 100;

  for (let i = todoListStore.order.length; i < count; i++) {
    const uuid = generateUUID();
    todoListStore.itemMap.set(uuid, {
      id: uuid,
      title: `item ${i}`,
      completed: false,
    });
    todoListStore.order.push([uuid]);
  }
};

const addManyObjectsButton = document.querySelector("#addManyObjectsButton")!;
addManyObjectsButton.addEventListener("click", () => {
  addManyObjects();
});
