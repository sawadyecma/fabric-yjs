import * as Y from "yjs";

/**
 * トランザクションメタデータに操作タイプを設定する
 *
 * 同じクライアントでしかmetaは取得できないため、注意
 */

const KEY_OPERATION_TYPE = "operationType";

const OPERATION = {
  ADD: "add",
  MODIFY: "modify",
  REMOVE: "remove",
} as const;

// 操作タイプ
type OpType = (typeof OPERATION)[keyof typeof OPERATION];

const setOpTypeToTxMeta = (tr: Y.Transaction, opType: OpType) => {
  tr.meta.set(KEY_OPERATION_TYPE, opType);
};

const isOpType = (opType: string): opType is OpType => {
  return Object.values(OPERATION).includes(opType as OpType);
};

const getOpTypeFromTxMeta = (tr: Y.Transaction): OpType => {
  const opType = tr.meta.get(KEY_OPERATION_TYPE);

  if (!isOpType(opType)) {
    throw new Error("Invalid operation type");
  }

  return opType;
};

export const txMetaUtil = {
  setOpTypeToTxMeta,
  getOpTypeFromTxMeta,
};
