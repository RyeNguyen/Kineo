import type { RootStackParamList } from "@/types";

import { createStackNavigator } from "@react-navigation/stack";

import { Paths } from "@/navigation/paths";

import { useTheme } from "@/shared/hook";
import { CountrySelectScreen, FeedScreen } from "@/features/movie/screens";

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { variant } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={Paths.Feed}
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={FeedScreen} name={Paths.Feed} />
      <Stack.Screen
        component={CountrySelectScreen}
        name={Paths.SelectCountry}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
