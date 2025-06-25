import type { RootStackParamList } from '@/types';

import { createStackNavigator } from '@react-navigation/stack';

import { Paths } from '@/navigation/paths';

import { StartupScreen } from '@/features/user/screens';

import { useTheme } from '@/shared/hook';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { variant } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={Paths.Startup}
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={StartupScreen} name={Paths.Startup} />
    </Stack.Navigator>
  );
}
