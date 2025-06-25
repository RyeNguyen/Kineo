import type { TextStyle } from "react-native";

import type { FontColors, FontStyles, UnionConfiguration } from "@/types";
import { config } from "./_config";
import { moderateScale, removeWhitespaceAndSymbols } from "@/shared/utils";

export const generateFontColors = (configuration: UnionConfiguration) => {
  return Object.entries(configuration.fonts.colors ?? {}).reduce(
    (acc, [key, value]) => {
      return Object.assign(acc, {
        [`${key}`]: {
          color: value,
        },
      });
    },
    {} as FontColors
  );
};

export const generateFontStyles = () => {
  return Object.entries(config.fonts.sizes ?? {}).reduce(
    (acc, [key, value]) => {
      config.fonts.fontFamily.forEach((fontName) => {
        Object.assign(acc, {
          [`size_${key}_${removeWhitespaceAndSymbols(fontName)}`]: {
            fontFamily: fontName,
            fontSize: moderateScale(value),
          },
        });
      });
      return acc;
    },
    {} as FontStyles
  );
};

export const staticFontStyles = {
  alignCenter: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  uppercase: {
    textTransform: "uppercase",
  },
} as const satisfies Record<string, TextStyle>;
