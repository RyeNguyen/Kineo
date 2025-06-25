import { DEVICE_SIZE } from "../constant";

export const scale = (size: number) =>
  (DEVICE_SIZE.width / DEVICE_SIZE.guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (DEVICE_SIZE.height / DEVICE_SIZE.guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
