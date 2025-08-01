const clientUniqueSymbol = Symbol("self");

export const ORIGIN_OPERATIONS = {
  add: {
    type: "add",
    clientUniqueSymbol: clientUniqueSymbol,
  },
  delete: {
    type: "delete",
    clientUniqueSymbol: clientUniqueSymbol,
  },
  update: {
    type: "update",
    clientUniqueSymbol: clientUniqueSymbol,
  },
  moveForward: {
    type: "moveForward",
    clientUniqueSymbol: clientUniqueSymbol,
  },
  moveBackward: {
    type: "moveBackward",
    clientUniqueSymbol: clientUniqueSymbol,
  },
} as const;

export type OriginOperation =
  (typeof ORIGIN_OPERATIONS)[keyof typeof ORIGIN_OPERATIONS];

export const isSameClient = (origin: unknown): origin is OriginOperation => {
  return (
    typeof origin === "object" &&
    origin !== null &&
    "clientUniqueSymbol" in origin &&
    origin.clientUniqueSymbol === clientUniqueSymbol
  );
};
