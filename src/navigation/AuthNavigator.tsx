import type { RootStackParamList } from '@/types';

import { createStackNavigator } from '@react-navigation/stack';

import { Paths } from '@/navigation/paths';

import { LoginScreen, RegisterScreen } from '@/features/auth/screens';

import { useTheme } from '@/shared/hook';

const Stack = createStackNavigator<RootStackParamList>();

export function AuthNavigator() {
  const { variant } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={Paths.Login}
      key={variant}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={LoginScreen} name={Paths.Login} />
      <Stack.Screen component={RegisterScreen} name={Paths.Register} />
    </Stack.Navigator>
  );
}
