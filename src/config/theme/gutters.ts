import { scale, verticalScale } from "@/shared/utils";
import type { Gutters, UnionConfiguration } from "@/types";
import { type ViewStyle } from "react-native";

export const generateGutters = (configuration: UnionConfiguration): Gutters => {
  return Object.entries(configuration.gutters ?? {}).reduce(
    (acc, [key, value]) => {
      return Object.assign(acc, {
        [`gap_${key}`]: {
          gap: scale(value),
        },
        [`margin_${key}`]: {
          margin: scale(value),
        },
        [`marginBottom_${key}`]: {
          marginBottom: verticalScale(value),
        },
        [`marginHorizontal_${key}`]: {
          marginHorizontal: scale(value),
        },
        [`marginLeft_${key}`]: {
          marginLeft: scale(value),
        },
        [`marginRight_${key}`]: {
          marginRight: scale(value),
        },
        [`marginTop_${key}`]: {
          marginTop: verticalScale(value),
        },
        [`marginVertical_${key}`]: {
          marginVertical: verticalScale(value),
        },
        [`padding_${key}`]: {
          padding: scale(value),
        },
        [`paddingBottom_${key}`]: {
          paddingBottom: verticalScale(value),
        },
        [`paddingHorizontal_${key}`]: {
          paddingHorizontal: scale(value),
        },
        [`paddingLeft_${key}`]: {
          paddingLeft: scale(value),
        },
        [`paddingRight_${key}`]: {
          paddingRight: scale(value),
        },
        [`paddingTop_${key}`]: {
          paddingTop: verticalScale(value),
        },
        [`paddingVertical_${key}`]: {
          paddingVertical: verticalScale(value),
        },
      });
    },
    {} as Gutters
  );
};

export const staticGutterStyles = {} as const satisfies Record<
  string,
  ViewStyle
>;
