import type { PropsWithChildren } from "react";
import type { SafeAreaViewProps } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useTheme from "@/shared/hook/useTheme";

import DefaultError from "@/shared/components/atoms/DefaultError";
import ErrorBoundary from "@/shared/components/atoms/ErrorBoundary";
import ErrorModal from "@/shared/components/atoms/ErrorModal";

type Props = PropsWithChildren<
  {
    error?: string;
    isError?: boolean;
    loading?: boolean;
    onCloseErrorModal?: () => void;
    onResetError?: () => void;
  } & Omit<SafeAreaViewProps, "mode">
>;

function SafeScreen({
  children = undefined,
  error = undefined,
  isError = false,
  loading = false,
  onCloseErrorModal = undefined,
  onResetError = undefined,
  style,
  ...props
}: Props) {
  const { layout, navigationTheme, variant } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={[layout.flex_1]}
    >
      <SafeAreaView {...props} mode="padding" style={[layout.flex_1, style]}>
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === "dark" ? "light-content" : "dark-content"}
        />
        <ErrorBoundary onReset={onResetError}>
          {isError ? <DefaultError onReset={onResetError} /> : children}
        </ErrorBoundary>
        {loading && (
          <View
            style={[
              layout.absolute,
              layout.itemsCenter,
              layout.justifyCenter,
              layout.fullWidth,
              layout.fullHeight,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <ActivityIndicator color={"white"} size="large" />
          </View>
        )}

        <ErrorModal
          errorMessage={error}
          onClose={onCloseErrorModal}
          visible={!!error}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default SafeScreen;
