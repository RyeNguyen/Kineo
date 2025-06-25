import { scale, verticalScale } from "@/shared/utils";
import type { ComponentTheme } from "@/types";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

interface AllStyle
  extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

export default ({ backgrounds, fonts, layout }: ComponentTheme) => {
  return {
    defaultInput: {
      height: verticalScale(48),
    },
    elementLg: {
      height: scale(32),
      width: scale(32),
    },
    elementMd: {
      height: scale(24),
      width: scale(24),
    },
    elementSm: {
      height: scale(16),
      width: scale(16),
    },
    elementXl: {
      height: scale(52),
      width: scale(52),
    },
    elementXs: {
      height: scale(12),
      width: scale(12),
    },
    hitSlotXs: {
      bottom: 10,
      left: 10,
      right: 10,
      top: 10,
    },
    lineHeightXl: {
      lineHeight: scale(48),
    },
  } as const satisfies AllStyle;
};
