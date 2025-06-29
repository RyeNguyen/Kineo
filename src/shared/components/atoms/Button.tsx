import React from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, TouchableOpacity } from "react-native";

import useTheme from "@/shared/hook/useTheme";
import IconByVariant from "./IconByVariant";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BOUNCE_PRESS_SCALE, SPRING_CONFIG } from "@/animations";

interface ButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle | ViewStyle>;
  disabled?: boolean;
  icon?: string;
  isSecondary?: boolean;
  onPress?: () => void;
  title?: string;
}

const Button = ({
  buttonStyle = {},
  buttonTextStyle = {},
  disabled = false,
  icon = "",
  isSecondary = false,
  onPress = () => {},
  title = "",
}: ButtonProps) => {
  const { backgrounds, borders, components, fonts, gutters, layout } =
    useTheme();
  const scale = useSharedValue(BOUNCE_PRESS_SCALE.to);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(BOUNCE_PRESS_SCALE.from, {
      damping: SPRING_CONFIG.damping,
      stiffness: SPRING_CONFIG.stiffness,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(BOUNCE_PRESS_SCALE.to, {
      damping: SPRING_CONFIG.damping,
      stiffness: SPRING_CONFIG.stiffness,
    });
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          layout.fullWidth,
          layout.itemsCenter,
          layout.justifyCenter,
          isSecondary ? backgrounds.transparent : backgrounds.primary400,
          gutters.paddingHorizontal_LARGE,
          gutters.paddingTop_TINY,
          gutters.paddingBottom_XSMALL,
          borders.rounded_16,
          isSecondary && borders.primary400,
          isSecondary && borders.w_1,
          icon && !title && components.elementXl,
          animatedStyle,
          buttonStyle,
        ]}
      >
        {icon && <IconByVariant path={icon} style={[components.elementMd]} />}
        {title && (
          <Text
            style={[
              isSecondary ? fonts.primary400 : fonts.gray400,
              isSecondary
                ? fonts.size_SM_BeVietnamProRegular
                : fonts.size_SM_BeVietnamProSemiBold,
              buttonTextStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Button;
