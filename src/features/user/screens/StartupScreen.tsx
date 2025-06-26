import { Keyboard, View } from "react-native";

import type { Paths } from "@/navigation/paths";
import useTheme from "@/shared/hook/useTheme";
import { Button, Input, Mascot, SafeScreen } from "@/shared/components/atoms";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootScreenProps } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { COMMON_NUMBERS, ICONS } from "@/shared/constant";
import { t } from "i18next";
import type { UserStartup } from "../models/user.model";
import { userStartupSchema } from "../models/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserState } from "../store";
import { updateUserData } from "../store";
import Animated, {
  Easing,
  FadeInLeft,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  getDiscoveredMovies,
  getPopularMovies,
  MovieState,
} from "@/features/movie/store/movieSlice";
import api from "@/services/axiosConfig";

function StartupScreen({ navigation }: RootScreenProps<Paths.Startup>) {
  const { backgrounds, components, fonts, gutters, layout } = useTheme();
  const { userInfo } = useSelector((state: { user: UserState }) => state.user);
  const { firstName: storeFirstName, lastName: storeLastName } = userInfo.data;
  const dispatch = useDispatch();
  const { control, handleSubmit, watch } = useForm<UserStartup>({
    resolver: zodResolver(userStartupSchema),
  });
  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const [headline, setHeadline] = useState<string>(t("startup:headline"));

  const hasValue = useSharedValue<boolean>(false);
  const animatedHeadlineStyle = useAnimatedStyle(() => {
    return {
      ...(!hasValue.value
        ? {
            ...gutters.paddingHorizontal_MEDIUM,
            ...fonts.primary500,
            ...fonts.size_XXL_HeptaSlabMedium,
            ...fonts.alignCenter,
            ...components.lineHeightXl,
          }
        : {
            ...fonts.primary500,
            ...fonts.size_MD_BeVietnamProRegular,
            ...fonts.alignCenter,
            ...gutters.marginBottom_XSMALL,
          }),
      // opacity: withDelay(
      //   1000, // Delay for opacity change
      //   withTiming(hasValue.value ? 1 : 0.5, { duration: 500 })
      // ),
      transform: [
        {
          scale: withDelay(
            500,
            withTiming(hasValue.value ? 1.1 : 1, { duration: 500 })
          ),
        },
      ],
    };
  });

  const { discoveries } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  console.log("🚀 ~ StartupScreen ~ discoveries:", discoveries);

  useEffect(() => {
    hasValue.value = !!firstNameValue || !!lastNameValue;

    if (firstNameValue || lastNameValue) {
      setHeadline(`Hi @${firstNameValue || ""}_${lastNameValue || ""}`);
    } else {
      setHeadline(t("startup:headline"));
    }
  }, [firstNameValue, lastNameValue, hasValue]);

  const onSubmit = (data: UserStartup) => {
    dispatch(updateUserData(data));
    Keyboard.dismiss();
  };

  useEffect(() => {
    dispatch(getDiscoveredMovies());
  }, [dispatch]);

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.itemsCenter,
          backgrounds.background50,
          gutters.paddingHorizontal_MEDIUM,
          gutters.paddingTop_XLARGE,
          gutters.paddingBottom_LARGE,
        ]}
      >
        <View
          style={[
            gutters.gap_XLARGE,
            layout.itemsCenter,
            layout.fullWidth,
            layout.flex_1,
          ]}
        >
          {/* <Mascot /> */}

          {/* <View>
            <Animated.Text style={[animatedHeadlineStyle]}>
              {t("startup:headline")}
            </Animated.Text>
            {(firstNameValue || lastNameValue) && (
              <Animated.Text
                entering={FadeInLeft.delay(200).easing(
                  Easing.inOut(Easing.quad)
                )}
                exiting={FadeOutRight}
                style={[
                  gutters.paddingHorizontal_MEDIUM,
                  fonts.primary500,
                  fonts.size_XXL_HeptaSlabMedium,
                  fonts.alignCenter,
                  components.lineHeightXl,
                ]}
              >
                {headline}
              </Animated.Text>
            )}
          </View>

          <View style={[layout.fullWidth, gutters.gap_MEDIUM]}>
            <View>
              <Controller
                control={control}
                defaultValue={storeFirstName}
                name="firstName"
                render={({ field: { onChange, value }, fieldState }) => {
                  return (
                    <Input
                      defaultValue=""
                      errorMsg={fieldState.error?.message}
                      maxLength={COMMON_NUMBERS.maxNameLength}
                      onChangeText={onChange}
                      placeholder={t("startup:first_name_placeholder")}
                      value={value}
                    />
                  );
                }}
              />
            </View>

            <View>
              <Controller
                control={control}
                defaultValue={storeLastName}
                name="lastName"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    defaultValue=""
                    errorMsg={fieldState.error?.message}
                    maxLength={COMMON_NUMBERS.maxNameLength}
                    onChangeText={onChange}
                    placeholder={t("startup:last_name_placeholder")}
                    value={value}
                  />
                )}
              />
            </View>
          </View> */}
        </View>

        {/* <View style={[layout.row, layout.fullWidth, layout.justifyEnd]}>
          <Button icon={ICONS.iconNextWhite} onPress={handleSubmit(onSubmit)} />
        </View> */}
      </View>
    </SafeScreen>
  );
}

export default StartupScreen;
