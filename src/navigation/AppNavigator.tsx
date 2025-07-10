import type { RootStackParamList } from "@/types";

import { createStackNavigator } from "@react-navigation/stack";

import { Paths } from "@/navigation/paths";

import { useTheme } from "@/shared/hook";
import {
  CountrySelectScreen,
  MovieDetailScreen,
} from "@/features/movie/screens";
import MainTabNavigator from "./MainTabNavigator";
import VideoScreen from "@/features/movie/screens/VideoScreen";

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { variant } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={Paths.Main}
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={MainTabNavigator} name={Paths.Main} />
      <Stack.Screen
        component={CountrySelectScreen}
        name={Paths.SelectCountry}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen component={VideoScreen} name={Paths.Video} />
      <Stack.Screen component={MovieDetailScreen} name={Paths.MovieDetail} />
    </Stack.Navigator>
  );
}
