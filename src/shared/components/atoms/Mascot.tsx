import React, { useEffect, useMemo } from "react";
import Svg, { Path, Rect, Ellipse } from "react-native-svg";

import useTheme from "@/shared/hook/useTheme";
import { StyleProp, ViewStyle } from "react-native";
import { MASCOT_SIZE } from "../../constant";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  useAnimatedProps,
} from "react-native-reanimated";
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent";

type MascotProps = {
  width?: number;
  height?: number;
  hasFace?: boolean;
  mascotStyle?: StyleProp<ViewStyle>;
  mascotColor?: string;
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const Mascot = ({
  width,
  height,
  hasFace = true,
  mascotStyle,
  mascotColor,
}: MascotProps) => {
  const { colors } = useTheme();
  const floatY = useSharedValue(0);
  const eyeY = useSharedValue(63);
  const eyeOriginalY = 63;
  const eyeOriginalHeight = 41;
  const minHeight = 5;
  const blinkDuration = 80;
  const eyeHeight = useSharedValue(eyeOriginalHeight);
  const breathDuration = useMemo(() => 2500 + Math.random() * 1000, []);

  useEffect(() => {
    floatY.value = withDelay(
      Math.random() * 1000,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: breathDuration }),
          withTiming(0, { duration: breathDuration })
        ),
        -1,
        true
      )
    );
  }, []);

  useEffect(() => {
    const blink = () => {
      const minHeight = 5;
      const duration = 80;

      eyeHeight.value = withSequence(
        withTiming(minHeight, { duration }),
        withTiming(41, { duration }),
        withDelay(
          100,
          withSequence(
            // Nháy lần 2
            withTiming(minHeight, { duration }),
            withTiming(41, { duration })
          )
        )
      );

      eyeY.value = withSequence(
        withTiming(63 + (41 - minHeight), { duration }), // đẩy y lên
        withTiming(63, { duration }),
        withDelay(
          100,
          withSequence(
            withTiming(63 + (41 - minHeight), { duration }),
            withTiming(63, { duration })
          )
        )
      );
    };

    const interval = setInterval(blink, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // Blink animation
  const eyeProps = useAnimatedProps(() => {
    const yOffset = eyeOriginalY + (eyeOriginalHeight - eyeHeight.value);
    return {
      height: eyeHeight.value,
      y: yOffset,
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Svg
        width={width || MASCOT_SIZE.width}
        height={height || MASCOT_SIZE.height}
        style={mascotStyle}
        viewBox="0 0 200 180"
      >
        <Ellipse
          cx="98.5"
          cy="82.5701"
          rx="98.5"
          ry="82.5701"
          fill={mascotColor || colors.primary500}
        />
        <Path
          d="M31.6156 162.303C30.0906 162.951 28.4444 161.68 28.6838 160.041L32.0644 136.89C32.2991 135.283 34.1776 134.523 35.4636 135.516L53.6183 149.522C54.9043 150.514 54.6461 152.524 53.151 153.159L31.6156 162.303Z"
          fill={mascotColor || colors.primary500}
        />
        {hasFace && (
          <>
            <AnimatedRect
              x="60"
              y="63"
              width="7"
              height="41"
              rx="3.5"
              fill={colors.white}
              animatedProps={eyeProps}
            />
            <AnimatedRect
              x="131"
              y="63"
              width="7"
              height="41"
              rx="3.5"
              fill={colors.white}
              animatedProps={eyeProps}
            />

            <Path
              d="M102.045 140.424C100.448 142.299 97.5518 142.299 95.9546 140.424L79.0671 120.593C76.8554 117.996 78.7011 114 82.1125 114L115.887 114C119.299 114 121.145 117.996 118.933 120.593L102.045 140.424Z"
              fill={colors.white}
            />
          </>
        )}
      </Svg>
    </Animated.View>
  );
};

export default Mascot;
