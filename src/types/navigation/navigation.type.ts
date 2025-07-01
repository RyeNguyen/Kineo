import type { StackScreenProps } from "@react-navigation/stack";
import type { Paths } from "@/navigation/paths";

export type RootStackParamList = {
  [Paths.Auth]: undefined;
  [Paths.Example]: undefined;
  [Paths.Feed]: undefined;
  [Paths.Login]: undefined;
  [Paths.Main]: undefined;
  [Paths.Register]: undefined;
  [Paths.SelectCountry]: undefined;
  [Paths.Startup]: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
