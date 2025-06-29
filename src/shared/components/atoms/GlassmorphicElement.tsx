import React, { useMemo, useState } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
// 1. Import BlurView from the new library
// eslint-disable-next-line import/no-extraneous-dependencies
import { BackdropBlur, Canvas, Fill, Skia } from "@shopify/react-native-skia";
import { useTheme } from "@/shared/hook";

interface GlassmorphicElementProps {
  children: React.ReactNode;
  extraStyles?: ViewStyle | ViewStyle[];
}

const GlassmorphicElement = ({
  children,
  extraStyles = {},
}: GlassmorphicElementProps) => {
  const { borders, layout } = useTheme();

  const [layoutSize, setLayoutSize] = useState<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setLayoutSize({ height, width });
  };

  const radius = useMemo(() => layoutSize.width / 2, [layoutSize.width]);

  const clipPath = useMemo(() => {
    if (!layoutSize.width || !layoutSize.height) {
      return Skia.RRectXY(Skia.XYWHRect(0, 0, 0, 0), 0, 0);
    }
    return Skia.RRectXY(
      Skia.XYWHRect(0, 0, layoutSize.width, layoutSize.height),
      radius,
      radius
    );
  }, [layoutSize, radius]);

  return (
    <View
      onLayout={onLayout}
      style={[
        layout.itemsCenter,
        layout.relative,
        layout.justifyCenter,
        layout.hideOverflow,
        borders.rounded_100,
        extraStyles,
      ]}
    >
      {layoutSize.width > 0 && (
        <Canvas
          style={[
            layout.absolute,
            layout.top0,
            layout.right0,
            layout.bottom0,
            layout.left0,
            StyleSheet.absoluteFillObject,
          ]}
        >
          <BackdropBlur blur={40} clip={clipPath}>
            <Fill color="rgba(82, 77, 77, 0.6)" />
          </BackdropBlur>
        </Canvas>
      )}

      {children}
    </View>
  );
};

export default GlassmorphicElement;
