import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import type {
  BottomSheetDefaultFooterProps,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Portal } from "@gorhom/portal";

import Button from "./Button";
import { useTheme } from "../../hook";
import layout from "@/config/theme/layout";

type BaseBottomSheetProps = {
  actionLabel?: string;
  children: React.ReactNode;
  hasFooter?: boolean;
  hasHeader?: boolean;
  onAction?: () => void;
  onClose?: () => void;
  renderFooterModal?: React.FC<BottomSheetFooterProps> | undefined;
  renderHeader?: React.ReactElement<
    unknown,
    React.JSXElementConstructor<unknown> | string
  >;
  scrollEnable?: boolean;
  snapPoints?: (number | string)[]; // <- snapPoints added
  title?: string;
} & BottomSheetProps;

export type BaseBottomSheetRef = {
  close: () => void;
  onExpand: () => void;
};

const BaseBottomSheetInner = (
  {
    actionLabel = "",
    children,
    hasFooter = true,
    hasHeader = true,
    onAction = undefined,
    onClose = undefined,
    renderFooterModal = undefined,
    renderHeader = undefined,
    scrollEnable = false,
    snapPoints = [],
    title = "",
    ...otherProps
  }: BaseBottomSheetProps,
  ref: React.Ref<BaseBottomSheetRef>
) => {
  const { backgrounds, borders, gutters } = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [contentHeight, setContentHeight] = useState<number>(1);

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
    bottomSheetRef.current?.close();
    setCurrentIndex(-1);
  }, [onClose]);

  const renderBackdrop = useCallback(
    ({
      animatedIndex,
      style,
    }: BottomSheetDefaultBackdropProps & React.JSX.IntrinsicAttributes) => {
      // animated variables
      const containerAnimatedStyle = useAnimatedStyle(() => {
        "worklet";
        const isHidden = currentIndex === -1;

        return {
          backfaceVisibility: "hidden",
          backgroundColor: "transparent",
          display: isHidden ? "none" : "flex",
          opacity: interpolate(
            currentIndex,
            [-1, 0],
            [0, 0.5],
            Extrapolation.CLAMP
          ),
          pointerEvents: isHidden ? "none" : "auto",
        };
      });

      // styles
      const containerStyle = useMemo(
        () => [
          style,
          {
            flex: 1,
          },
          containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
      );

      const closeSheet = () => {
        closeModal();
      };

      const backdropTap = Gesture.Tap()
        .maxDuration(10_000)
        .onEnd(closeSheet)
        .runOnJS(true);

      return (
        <GestureDetector gesture={backdropTap}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              containerStyle,
              { backgroundColor: "rgba(0,0,0,0.5)" },
              style,
            ]}
          />
        </GestureDetector>
      );
    },
    [currentIndex, closeModal]
  );

  useImperativeHandle(ref, () => ({
    close: () => {
      bottomSheetRef.current?.close();
      setCurrentIndex(-1);
    },
    onExpand: () => {
      bottomSheetRef.current?.expand();
      setCurrentIndex(0);
    },
  }));

  const onSubmit = useCallback(() => {
    bottomSheetRef.current?.close();
    setCurrentIndex(-1);
    if (onAction) {
      onAction();
    }
  }, [onAction]);

  // renders
  const renderFooter = useCallback(
    (props: BottomSheetDefaultFooterProps & React.JSX.IntrinsicAttributes) => (
      <BottomSheetFooter
        {...props}
        bottomInset={0}
        // style={components.shadowBox5Inverted}
      >
        <View
          style={[
            gutters.paddingHorizontal_MEDIUM,
            gutters.paddingTop_SMALL,
            backgrounds.gray800,
          ]}
        >
          <Button onPress={onSubmit} title={actionLabel || ""} />
        </View>
      </BottomSheetFooter>
    ),
    [
      actionLabel,
      backgrounds.gray800,
      gutters.paddingHorizontal_MEDIUM,
      gutters.paddingTop_SMALL,
      onSubmit,
    ]
  );

  const handleCalulateLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <BottomSheet
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        enableHandlePanningGesture={false}
        enablePanDownToClose={false}
        footerComponent={renderFooterModal ? renderFooterModal : renderFooter}
        handleComponent={null}
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints.length > 0 ? snapPoints : [contentHeight]}
        topInset={insets.top}
        {...otherProps}
      >
        <BottomSheetView
          onLayout={handleCalulateLayout}
          style={[
            layout.flex_1,
            backgrounds.gray800,
            gutters.padding_MEDIUM,
            gutters.paddingBottom_LARGE,
            gutters.gap_MEDIUM,
            borders.roundedTop_16,
          ]}
        >
          {/* Header */}
          {renderHeader}

          {/* Body */}
          {!scrollEnable ? (
            children
          ) : (
            <BottomSheetScrollView
              contentContainerStyle={[gutters.paddingBottom_COLOSSAL]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </BottomSheetScrollView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
};
const BaseBottomSheet = forwardRef<BaseBottomSheetRef, BaseBottomSheetProps>(
  BaseBottomSheetInner
);
export default BaseBottomSheet;
