import type { AllPartial } from "./common.type";
import type { Theme as NavigationTheme } from "@react-navigation/native";
import type { config } from "@/config/theme/_config";
import type generateConfig from "@/config/theme/ThemeProvider/generateConfig";

export type Variant = "default" | keyof typeof config.variants;

export type ThemeState = {
  variant: Variant;
};

export type FulfilledThemeConfiguration = {
  readonly backgrounds: Record<string, string>;
  borders: {
    readonly colors: Record<string, string>;
    radius: readonly number[];
    widths: readonly number[];
  };
  readonly colors: Record<string, string>;
  fonts: {
    readonly colors: Record<string, string>;
    fontFamily: readonly string[];
    readonly sizes: Record<string, number>;
  };
  readonly gutters: Record<string, number>;
  readonly navigationColors: NavigationTheme["colors"];
};

export type VariantThemeConfiguration = {
  readonly backgrounds: FulfilledThemeConfiguration["backgrounds"];
  borders: {
    readonly colors: FulfilledThemeConfiguration["borders"]["colors"];
  };
  readonly colors: FulfilledThemeConfiguration["colors"];
  fonts: {
    readonly colors: FulfilledThemeConfiguration["fonts"]["colors"];
  };
  readonly navigationColors: Partial<NavigationTheme["colors"]>;
};

export type ThemeConfiguration = {
  variants: {
    [key: PropertyKey]: AllPartial<VariantThemeConfiguration>;
  };
} & FulfilledThemeConfiguration;

export type UnionConfiguration = ReturnType<typeof generateConfig>;
