import { Vector3 } from "three";

export const defaultCameraPosition = new Vector3(20, 20, 20);

export function computeCameraForBox(
  length: number,
  height: number,
  width: number,
) {
  const maxDim = Math.max(length, height, width);
  return new Vector3(maxDim * 1.5, maxDim * 1.5, maxDim * 1.5);
}
