import type { RemoveBeforeSeparator } from "./common.type";
import type { UnionConfiguration } from "./config.type";
import type { config } from "@/config/theme/_config";
import type { staticFontStyles } from "@/config/theme/fonts";
export type FontFamily =
  | "BeVietnamProBlack"
  | "BeVietnamProBlackItalic"
  | "BeVietnamProBold"
  | "BeVietnamProBoldItalic"
  | "BeVietnamProExtraBold"
  | "BeVietnamProExtraBoldItalic"
  | "BeVietnamProExtraLight"
  | "BeVietnamProExtraLightItalic"
  | "BeVietnamProMedium"
  | "BeVietnamProMediumItalic"
  | "BeVietnamProRegular"
  | "BeVietnamProRegularItalic"
  | "BeVietnamProSemiBold"
  | "BeVietnamProSemiBoldItalic"
  | "BeVietnamProThin"
  | "BeVietnamProThinItalic"
  | "HeptaSlabBlack"
  | "HeptaSlabBold"
  | "HeptaSlabExtraBold"
  | "HeptaSlabExtraLight"
  | "HeptaSlabLight"
  | "HeptaSlabMedium"
  | "HeptaSlabRegular"
  | "HeptaSlabSemiBold"
  | "HeptaSlabThin";
type FontStylesKeys = `size_${keyof typeof config.fonts.sizes}_${FontFamily}`;

export type FontStyles = {
  [key in FontStylesKeys]: {
    fontFamily: string;
    fontSize: number;
  };
};

type FontColorsKeys = `${keyof UnionConfiguration["fonts"]["colors"]}`;

export type FontColors = {
  [key in FontColorsKeys]: RemoveBeforeSeparator<key> extends keyof UnionConfiguration["fonts"]["colors"]
    ? {
        color: UnionConfiguration["fonts"]["colors"][RemoveBeforeSeparator<key>];
      }
    : never;
};

export type Fonts = FontColors & FontStyles & typeof staticFontStyles;
