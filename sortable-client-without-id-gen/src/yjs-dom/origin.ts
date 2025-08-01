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

export const isSameClient = (origin: OriginOperation) => {
  return origin.clientUniqueSymbol === clientUniqueSymbol;
};

export const isOriginOperation = (v: unknown): v is OriginOperation => {
  if (typeof v !== "object" || v === null) return false;
  if (!("type" in v) || typeof v.type !== "string") return false;
  if (!("clientUniqueSymbol" in v) || typeof v.clientUniqueSymbol !== "symbol")
    return false;
  return Object.values(ORIGIN_OPERATIONS).some(
    (operation) => operation.type === v.type
  );
};
