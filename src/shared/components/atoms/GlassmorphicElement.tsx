// src/shared/components/atoms/GlassmorphismButton.tsx

import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
// 1. Import BlurView from the new library
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BackdropBlur,
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
import { useTheme } from "@/shared/hook";

interface GlassmorphicElementProps {
  children: React.ReactNode;
  extraStyles?: ViewStyle | ViewStyle[];
}

const GlassmorphicElement = ({
  children,
  extraStyles = {},
}: GlassmorphicElementProps) => {
  const { borders, colors, layout } = useTheme();

  return (
    <View
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        layout.hideOverflow,
        borders.rounded_16,
        extraStyles,
      ]}
    >
      <Canvas style={layout.flex_1}>
        <BackdropBlur
          clip={{ height: 40, rx: 16, width: 40, x: 0, y: 0 }}
          intensity={25}
        />

        <RoundedRect
          color="rgba(255, 255, 255, 0.15)" // A semi-transparent white for the glass [00:03:45]
          height={40}
          r={16}
          width={40}
          x={0}
          y={0}
        />

        <RoundedRect
          height={39}
          r={16}
          strokeWidth={1}
          style="stroke"
          width={39}
          x={0.5}
          y={0.5}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)"]}
            end={vec(40, 40)}
            start={vec(0, 0)}
          />
        </RoundedRect>
      </Canvas>
      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          layout.hideOverflow,
          borders.rounded_16,
          extraStyles,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export default GlassmorphicElement;
