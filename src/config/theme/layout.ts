import { verticalScale } from "@/shared";
import type { TextStyle, ViewStyle } from "react-native";

export default {
  col: {
    flexDirection: "column",
  },
  colReverse: {
    flexDirection: "column-reverse",
  },
  hideOverflow: {
    overflow: "hidden",
  },
  itemsCenter: {
    alignItems: "center",
  },
  itemsEnd: {
    alignItems: "flex-end",
  },
  itemsStart: {
    alignItems: "flex-start",
  },
  itemsStretch: {
    alignItems: "stretch",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  wrap: {
    flexWrap: "wrap",
  },
  /* Sizes Layouts */
  flex_1: {
    flex: 1,
  },
  flexGrow_1: {
    flexGrow: 1,
  },
  flexShrink_1: {
    flexShrink: 1,
  },
  fullHeight: {
    height: "100%",
  },
  fullWidth: {
    width: "100%",
  },
  /* Positions */
  absolute: {
    position: "absolute",
  },
  bottom0: {
    bottom: 0,
  },
  left0: {
    left: 0,
  },
  lineHeightMD: {
    lineHeight: verticalScale(22),
  },
  relative: {
    position: "relative",
  },
  right0: {
    right: 0,
  },
  top0: {
    top: 0,
  },
  z0: {
    zIndex: 0,
  },
  z1: {
    zIndex: 1,
  },
  z10: {
    zIndex: 10,
  },
} as const satisfies Record<string, TextStyle | ViewStyle>;
