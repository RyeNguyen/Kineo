import type { ThemeConfiguration } from "@/types";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const enum Variant {
  DARK = "dark",
}

const colorsLight = {
  black: "#000000",
  gray100: "#DFDFDF",
  gray200: "#A1A1A1",
  gray400: "#4D4D4D",
  gray50: "#EFEFEF",
  gray800: "#303030",
  purple100: "#E1E1EF",
  purple50: "#1B1A23",
  purple500: "#44427D",
  red500: "#C13333",
  skeleton: "#A1A1A1",
  transparent: "transparent",
  white: "#ffffff",

  // Primary
  primary400: "#597863",
  primary500: "#45624E",
  primary600: "#5C665A",

  // Background
  background50: "#E8E8E8",
} as const;

const colorsDark = {
  black: "#000000",
  gray100: "#000000",
  gray200: "#BABABA",
  gray400: "#969696",
  gray50: "#EFEFEF",
  gray800: "#E0E0E0",
  purple100: "#252732",
  purple50: "#1B1A23",
  purple500: "#A6A4F0",
  red500: "#C13333",
  skeleton: "#303030",
  transparent: "transparent",
  white: "#ffffff",

  // Primary
  primary400: "#597863",
  primary500: "#45624E",
  primary600: "#5C665A",

  // Background
  background50: "#E8E8E8",
} as const;

const sizes = {
  COLOSSAL: 80,
  GIGANTIC: 64,
  HUGE: 40,
  LARGE: 24,
  MASSIVE: 48,
  MEDIUM: 16,
  SMALL: 12,
  TINY: 4,
  XLARGE: 32,
  XSMALL: 8,
  ZERO: 0,
} as const;

const fontSizes = {
  LG: 20,
  MD: 16,
  SM: 14,
  XL: 24,
  XS: 12,
  XXL: 32,
} as const;

const fontFamilies = [
  "BeVietnamPro-Black",
  "BeVietnamPro-BlackItalic",
  "BeVietnamPro-Bold",
  "BeVietnamPro-BoldItalic",
  "BeVietnamPro-ExtraBold",
  "BeVietnamPro-ExtraBoldItalic",
  "BeVietnamPro-ExtraLight",
  "BeVietnamPro-ExtraLightItalic",
  "BeVietnamPro-Medium",
  "BeVietnamPro-MediumItalic",
  "BeVietnamPro-Regular",
  "BeVietnamPro-RegularItalic",
  "BeVietnamPro-SemiBold",
  "BeVietnamPro-SemiBoldItalic",
  "BeVietnamPro-Thin",
  "BeVietnamPro-ThinItalic",
  "HeptaSlab-Black",
  "HeptaSlab-Bold",
  "HeptaSlab-ExtraBold",
  "HeptaSlab-ExtraLight",
  "HeptaSlab-Light",
  "HeptaSlab-Medium",
  "HeptaSlab-Regular",
  "HeptaSlab-SemiBold",
  "HeptaSlab-Thin",
] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 8, 12, 16, 24, 32, 100],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    fontFamily: fontFamilies,
    sizes: fontSizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;
