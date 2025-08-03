import * as fabric from "fabric";

/**
 * @example
 *
 * ```ts
 * activeSelection: fabric.ActiveSelection
 * obj: fabric.FabricObject
 *
 * const selectionMatrix = activeSelection.calcTransformMatrix();
 * const clone = await obj.clone();
 * // 相対位置から絶対位置に変換
 * const absProps = getAbsPropsFromActiveSelection(obj, selectionMatrix);
 * clone.set({ ...absProps });
 * ```
 *
 */
export const getAbsPropsFromActiveSelection = (
  obj: fabric.FabricObject,
  activeSelectionMatrix: fabric.TMat2D
) => {
  const relPoint = obj.getRelativeXY();
  const absPoint = relPoint.transform(activeSelectionMatrix);
  const transform = fabric.util.qrDecompose(activeSelectionMatrix); // 選択BoundingBoxの変形を取得

  return {
    left: absPoint.x,
    top: absPoint.y,
    scaleX: obj.scaleX * transform.scaleX,
    scaleY: obj.scaleY * transform.scaleY,
    angle: obj.angle + transform.angle,
    skewX: obj.skewX + transform.skewX,
    skewY: obj.skewY + transform.skewY,
  };
};
