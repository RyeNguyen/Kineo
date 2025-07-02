import type { Paths } from "@/navigation/paths";
import { SafeScreen } from "@/shared/components/molecules";
import { COMMON_NUMBERS, DEVICE_SIZE, ICONS } from "@/shared/constant";
import { useTheme } from "@/shared/hook";
import type { RootScreenProps } from "@/types";
import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { useDispatch, useSelector } from "react-redux";
import type { MovieDetailState } from "../store/movieDetailSlice";
import { getMovieDetail } from "../store/movieDetailSlice";
import FastImage from "react-native-fast-image";
import Config from "react-native-config";
import { moderateScale, verticalScale } from "@/shared";
import { getYear } from "@/shared/utils/dateHelper";
import { Button, IconByVariant } from "@/shared/components/atoms";
import type { MovieGenre } from "../models/movie.model";
import { t } from "i18next";

const VIDEO_WIDTH = Math.min(DEVICE_SIZE.width, COMMON_NUMBERS.maxVideoWidth);
const VIDEO_HEIGHT = VIDEO_WIDTH / COMMON_NUMBERS.youtubeAspectRatio;

const MovieDetailScreen = ({
  navigation,
  route,
}: RootScreenProps<Paths.MovieDetail>) => {
  const { movieId, trailerKey } = route.params;

  const { backgrounds, borders, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { currentMovie } = useSelector(
    (state: { movieDetail: MovieDetailState }) => state.movieDetail
  );
  const { data } = currentMovie;
  console.log("🚀 ~ currentMovie:", currentMovie);

  const moviePoster = useMemo(() => {
    if (!data || !data.poster_path) {
      return null;
    }
    return `${Config.IMAGE_BASE_URL}${data.poster_path}`;
  }, [data]);

  const movieTitle = useMemo(() => {
    if (!data) {
      return null;
    }

    return `${data.title || data.name} (${getYear(data.release_date || data.first_air_date || Date.now().toString())})`;
  }, [data]);

  useEffect(() => {
    dispatch(getMovieDetail({ movieId }));
  }, [dispatch, movieId]);

  return (
    <SafeScreen style={[backgrounds.background800, gutters.gap_LARGE]}>
      <View>
        <YoutubeIframe
          height={VIDEO_HEIGHT}
          initialPlayerParams={{
            controls: false,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
          }}
          // ref={playerRef}
          mute={true}
          // onChangeState={onStateChange}
          play={true}
          videoId={trailerKey}
          width={VIDEO_WIDTH}
        />

        <View
          style={[
            layout.row,
            layout.itemsStart,
            gutters.gap_MEDIUM,
            gutters.paddingHorizontal_MEDIUM,
          ]}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              priority: FastImage.priority.high,
              uri: moviePoster || "",
            }}
            style={[borders.rounded_8, styles.moviePoster]}
          />

          <View style={[layout.flexShrink_1, gutters.gap_XSMALL]}>
            <Text style={[fonts.white, fonts.size_LG_BeVietnamProBold]}>
              {movieTitle}
            </Text>

            <View style={[layout.row, gutters.gap_XSMALL]}>
              <IconByVariant path={ICONS.iconStarActive} />
              <Text
                style={[
                  layout.itemsCenter,
                  fonts.white,
                  fonts.size_SM_BeVietnamProSemiBold,
                ]}
              >
                {data?.vote_average}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            gutters.gap_XSMALL,
            gutters.paddingHorizontal_MEDIUM,
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {(data?.genres || []).map((genre: MovieGenre) => (
            <Button isSecondary key={genre.id} title={genre.name} />
          ))}
        </ScrollView>
      </View>

      <View style={[gutters.paddingHorizontal_MEDIUM, gutters.gap_SMALL]}>
        <View style={[gutters.gap_TINY]}>
          <Text
            style={[
              layout.lineHeightMD,
              fonts.size_SM_BeVietnamProSemiBold,
              fonts.white,
            ]}
          >
            {t("detail:overview")}
          </Text>
          <View
            style={[
              backgrounds.white,
              borders.rounded_16,
              styles.titleIndicator,
            ]}
          />
        </View>

        <Text
          style={[
            fonts.white,
            fonts.size_SM_BeVietnamProRegular,
            layout.lineHeightMD,
          ]}
        >
          {data?.overview}
        </Text>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  moviePoster: {
    height: verticalScale(171),
    top: verticalScale(-36),
    width: moderateScale(114),
  },
  titleIndicator: {
    height: verticalScale(3),
    width: "52%",
  },
});

export default MovieDetailScreen;
