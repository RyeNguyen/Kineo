import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import useTheme from "@/shared/hook/useTheme";
import IconByVariant from "./IconByVariant";
import { ICONS } from "../../constant";

interface CustomTextInputProps extends TextInputProps {
  errorMsg?: string;
  errorStyle?: StyleProp<TextStyle | ViewStyle>;
  isSecured?: boolean;
}

const Input = ({
  errorMsg = "",
  errorStyle = {},
  isSecured = false,
  ...props
}: CustomTextInputProps) => {
  const { backgrounds, borders, colors, components, fonts, gutters, layout } =
    useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  return (
    <>
      <View
        style={[
          layout.fullWidth,
          layout.row,
          layout.itemsCenter,
          backgrounds.gray500Opaque60,
          gutters.paddingHorizontal_MEDIUM,
          gutters.gap_XSMALL,
          borders.rounded_16,
          borders.w_2,
          !!errorMsg
            ? borders.red500
            : isFocused
              ? borders.primary400
              : borders.transparent,
          components.defaultInput,
        ]}
      >
        <IconByVariant path={ICONS.iconSearch} />
        <TextInput
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          placeholderTextColor={colors.gray100}
          secureTextEntry={isSecured && !isPasswordShown}
          style={[
            fonts.white,
            fonts.size_SM_BeVietnamProRegular,
            layout.flex_1,
          ]}
          {...props}
        />
        {isSecured && (
          <TouchableOpacity
            hitSlop={components.hitSlotXs}
            onPress={() => setIsPasswordShown(!isPasswordShown)}
          >
            <IconByVariant
              path={isPasswordShown ? ICONS.iconEye : ICONS.iconEyeHidden}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMsg && (
        <Text
          style={[
            fonts.red500,
            fonts.size_SM_BeVietnamProRegular,
            gutters.marginTop_TINY,
            errorStyle,
          ]}
        >
          {errorMsg}
        </Text>
      )}
    </>
  );
};

export default Input;
