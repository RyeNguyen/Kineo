import type { AuthState } from "@/features/auth/store/authSlice";
import type { RootScreenProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Paths } from "@/navigation/paths";
import { StateStatus } from "@/config";
import { loginRequest, resetError } from "@/features/auth/store/authSlice";

import { Button, Input, Mascot, SafeScreen } from "@/shared/components/atoms";

import useTheme from "@/shared/hook/useTheme";
import { COMMON_NUMBERS, DEVICE_SIZE, ICONS } from "@/shared/constant";
import { t } from "i18next";
import type { LoginForm } from "../models/auth.model";
import { loginFormSchema } from "../models/auth.model";
import Animated from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";

function LoginScreen({ navigation }: RootScreenProps<Paths.Login>) {
  const { backgrounds, colors, fonts, gutters, layout } = useTheme();
  const dispatch = useDispatch();
  const { error, status } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (data: LoginForm) => {
    Keyboard.dismiss();
    dispatch(loginRequest({ data, isLogin: true })); // Call login action
  };

  const onCloseErrorModal = () => {
    dispatch(resetError());
  };

  useEffect(() => {
    if (status == StateStatus.SUCCESS) {
      navigation.navigate(Paths.Example);
    }
  }, [navigation, status]);

  return (
    <SafeScreen
      error={error}
      // loading={status == StateStatus.LOADING}
      onCloseErrorModal={onCloseErrorModal}
    >
      <ScrollView
        contentContainerStyle={[
          layout.relative,
          layout.col,
          layout.justifyBetween,
          layout.itemsCenter,
          layout.flexGrow_1,
          backgrounds.background50,
          gutters.paddingHorizontal_MEDIUM,
          gutters.paddingTop_XLARGE,
          gutters.paddingBottom_LARGE,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[layout.row, layout.fullWidth, layout.itemsStart, layout.z10]}
        >
          <Button buttonStyle={[backgrounds.white]} icon={ICONS.iconBack} />
        </View>

        <Animated.View
          sharedTransitionTag="sharedTag"
          style={[layout.absolute, layout.z1, styles.frontMascot]}
        >
          <Mascot
            hasFace={false}
            height={DEVICE_SIZE.height / 2.7}
            width={DEVICE_SIZE.width * 5}
          />
        </Animated.View>

        <View style={[layout.absolute, layout.z0, styles.backMascot]}>
          <Mascot
            hasFace={false}
            height={DEVICE_SIZE.height / 1.5}
            mascotColor={colors.primary400}
            width={DEVICE_SIZE.width * 8}
          />
        </View>

        <View
          style={[layout.fullWidth, layout.z10, gutters.paddingBottom_COLOSSAL]}
        >
          <Text
            style={[
              gutters.marginBottom_GIGANTIC,
              fonts.white,
              fonts.size_XXL_HeptaSlabMedium,
            ]}
          >
            {t("auth:login.headline")}
          </Text>

          <View style={[layout.fullWidth, gutters.gap_MEDIUM]}>
            <View>
              <Controller
                control={control}
                defaultValue=""
                name="email"
                render={({ field: { onChange, value }, fieldState }) => {
                  return (
                    <Input
                      defaultValue=""
                      errorMsg={fieldState.error?.message}
                      keyboardType="email-address"
                      onChangeText={onChange}
                      placeholder={t("auth:email_placeholder")}
                      value={value}
                    />
                  );
                }}
              />
            </View>

            <View>
              <Controller
                control={control}
                defaultValue=""
                name="password"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    defaultValue=""
                    errorMsg={fieldState.error?.message}
                    isSecured={true}
                    onChangeText={onChange}
                    placeholder={t("auth:password_placeholder")}
                    value={value}
                  />
                )}
              />
            </View>

            <View style={[layout.fullWidth, layout.itemsEnd]}>
              <TouchableOpacity>
                <Text
                  style={[fonts.size_SM_BeVietnamProSemiBold, fonts.primary500]}
                >
                  {t("auth:forgot_password", {
                    min: COMMON_NUMBERS.minPasswordLength,
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[gutters.marginTop_LARGE, layout.fullWidth]}>
            <Button
              onPress={handleSubmit(onSubmit)}
              title={t("auth:login.cta")}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Paths.Register)}
          style={[layout.row, gutters.gap_TINY]}
        >
          <Text style={[fonts.size_SM_BeVietnamProRegular, fonts.primary500]}>
            {t("auth:login.register_question")}
          </Text>
          <Text style={[fonts.size_SM_BeVietnamProSemiBold, fonts.primary500]}>
            {t("auth:login.register_now")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  backMascot: {
    top: -180,
    transform: [{ translateX: "-1%" }, { rotateY: "180deg" }],
  },
  frontMascot: { top: 80, transform: [{ translateX: "-4%" }] },
});

export default LoginScreen;
