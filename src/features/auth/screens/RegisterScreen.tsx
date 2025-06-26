import type { AuthState } from "@/features/auth/store/authSlice";
import type { RootScreenProps } from "@/types";

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
import { t } from "i18next";
import { DEVICE_SIZE, ICONS } from "@/shared/constant";
import type { RegisterForm } from "../models/auth.model";
import { registerFormSchema } from "../models/auth.model";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";

function RegisterScreen({ navigation }: RootScreenProps<Paths.Register>) {
  const { backgrounds, colors, fonts, gutters, layout } = useTheme();
  const dispatch = useDispatch();
  const { error, status } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );
  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    Keyboard.dismiss();
    dispatch(loginRequest({ data, isLogin: false })); // Call login action
  };

  const onCloseErrorModal = () => {
    dispatch(resetError());
  };

  useEffect(() => {
    if (status == StateStatus.SUCCESS) {
      navigation.navigate(Paths.Startup);
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
          style={[layout.absolute, styles.frontMascot]}
        >
          <Mascot
            hasFace={false}
            height={DEVICE_SIZE.height / 2.7}
            width={DEVICE_SIZE.width * 5}
          />
        </Animated.View>

        <View style={[layout.absolute, styles.backMascot]}>
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
              styles.registerHeadline,
            ]}
          >
            {t("auth:register.headline")}
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

            <View>
              <Controller
                control={control}
                defaultValue=""
                name="passwordConfirm"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    defaultValue=""
                    errorMsg={fieldState.error?.message}
                    isSecured={true}
                    onChangeText={onChange}
                    placeholder={t("auth:confirm_password_placeholder")}
                    value={value}
                  />
                )}
              />
            </View>
          </View>

          <View style={[gutters.marginTop_LARGE, layout.fullWidth]}>
            <Button
              onPress={handleSubmit(onSubmit)}
              title={t("auth:register.cta")}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Paths.Login)}
          style={[layout.row, gutters.gap_TINY]}
        >
          <Text style={[fonts.size_SM_BeVietnamProRegular, fonts.primary500]}>
            {t("auth:register.login_question")}
          </Text>
          <Text style={[fonts.size_SM_BeVietnamProSemiBold, fonts.primary500]}>
            {t("auth:register.login_now")}
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
    zIndex: 0,
  },
  frontMascot: { top: 80, transform: [{ translateX: "-4%" }], zIndex: 1 },
  registerHeadline: {
    width: "80%",
  },
});

export default RegisterScreen;
