import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FeedScreen } from "@/features/movie/screens";
import { SearchScreen } from "@/features/search/screens";
import { ProfileScreen } from "@/features/user/screens";
import { Paths } from "./paths";
import type { RootScreenProps, RootStackParamList } from "@/types";
import { IconByVariant } from "@/shared/components/atoms";
import { COMMON_NUMBERS, ICONS } from "@/shared/constant";
import { Text } from "react-native";
import { useTheme } from "@/shared/hook";
import { verticalScale } from "@/shared";
import { t } from "i18next";

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabNavigator = ({ navigation }: RootScreenProps<Paths.Main>) => {
  const { colors, fonts } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide the default header
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: string = "";

          switch (route.name) {
            case Paths.Feed:
              iconName = focused ? ICONS.iconMovieActive : ICONS.iconMovie;
              break;
            case Paths.Profile:
              iconName = focused ? ICONS.iconProfileActive : ICONS.iconProfile;
              break;
            case Paths.Search:
              iconName = focused ? ICONS.iconSearchActive : ICONS.iconSearch;
              break;
            default:
          }

          return <IconByVariant path={ICONS[iconName as keyof typeof ICONS]} />;
        },
        tabBarLabel: ({ focused }) => {
          let tabBarName: string = "";

          switch (route.name) {
            case Paths.Feed:
              tabBarName = t("tab:trailer");
              break;
            case Paths.Profile:
              tabBarName = t("tab:profile");
              break;
            case Paths.Search:
              tabBarName = t("tab:search");
              break;
            default:
          }

          return (
            <Text
              style={[
                focused ? fonts.primary400 : fonts.white,
                focused
                  ? fonts.size_XS_BeVietnamProSemiBold
                  : fonts.size_XS_BeVietnamProRegular,
              ]}
            >
              {tabBarName}
            </Text>
          );
        },
        tabBarStyle: {
          backgroundColor: colors.gray800,
          borderTopWidth: 0,
          height: verticalScale(COMMON_NUMBERS.tabBarHeight),
        },
      })}
    >
      <Tab.Screen component={FeedScreen} name={Paths.Feed} />
      <Tab.Screen component={SearchScreen} name={Paths.Search} />
      <Tab.Screen component={ProfileScreen} name={Paths.Profile} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
