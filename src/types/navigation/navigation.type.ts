import type { StackScreenProps } from "@react-navigation/stack";
import type { Paths } from "@/navigation/paths";
import type { MovieDetailWithMetadata } from "@/features/movie/store/movieDetailSlice";

export type RootStackParamList = {
  [Paths.Auth]: undefined;
  [Paths.Example]: undefined;
  [Paths.Feed]: undefined;
  [Paths.FullScreenPlayer]: {
    videoId: string;
  };
  [Paths.Login]: undefined;
  [Paths.Main]: undefined;
  [Paths.MovieDetail]: {
    movieId: number;
    trailerKey: string;
  };
  [Paths.Profile]: undefined;
  [Paths.Register]: undefined;
  [Paths.Search]: undefined;
  [Paths.SelectCountry]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Video]: {
    firstVideo?: string;
    movie: MovieDetailWithMetadata;
  };
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
