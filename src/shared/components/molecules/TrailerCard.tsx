/* eslint-disable import/no-extraneous-dependencies */
import type {
  MovieState,
  MovieWithMetadata,
} from "@/features/movie/store/movieSlice";
import {
  COMMON_NUMBERS,
  DEVICE_SIZE,
  ICONS,
  StateStatus,
  VideoStatus,
} from "@/shared/constant";
import { useTheme } from "@/shared/hook";
import { getYear } from "@/shared/utils/dateHelper";
import { t } from "i18next";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import type { TapGestureHandlerStateChangeEvent } from "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { moderateScale, verticalScale } from "@/shared/utils";
import { Button, GlassmorphicElement, IconByVariant, Loader } from "../atoms";
import Config from "react-native-config";

interface TrailerCardProps {
  cardHeight?: number;
  isPaused: boolean;
  movie: MovieWithMetadata;
}

const VIDEO_WIDTH = Math.min(DEVICE_SIZE.width, COMMON_NUMBERS.maxVideoWidth);
const VIDEO_HEIGHT = VIDEO_WIDTH / COMMON_NUMBERS.youtubeAspectRatio;

const TrailerCard = ({
  cardHeight = DEVICE_SIZE.height,
  isPaused,
  movie,
}: TrailerCardProps) => {
  const { backgrounds, borders, colors, fonts, gutters, layout } = useTheme();

  const { activeTab, pagination } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  const { movies, status } = pagination[activeTab];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  const playerRef = useRef<typeof YoutubeIframe>(null);

  useEffect(() => {
    if (!isPaused) {
      // When card becomes active, start playback and seek to 0
      setIsPlaying(true);
      playerRef.current?.seekTo(0, true);
    } else {
      // When card becomes inactive, stop playback
      setIsPlaying(false);
    }
  }, [isPaused]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isSeeking) {
      interval = setInterval(async () => {
        const currentTime = await playerRef.current?.getCurrentTime();
        if (currentTime !== undefined) {
          setProgress(currentTime);
        }
      }, COMMON_NUMBERS.pollingTime); // Poll every 500ms
    }

    // Cleanup function that clears the interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isSeeking]);

  const movieTitle = useMemo(() => {
    return `${movie.title || movie.name} (${getYear(movie.release_date || movie.first_air_date || Date.now().toString())})`;
  }, [movie.title, movie.name, movie.release_date, movie.first_air_date]);

  const moviePoster = useMemo(() => {
    if (!movie.poster_path) {
      return null;
    }
    return `${Config.IMAGE_BASE_URL}${movie.poster_path}`;
  }, [movie.poster_path]);

  const onStateChange = useCallback(async (state: string) => {
    if (state === VideoStatus.ENDED) {
      setProgress(0);
      playerRef.current?.seekTo(0, true);
    }
    if (state === VideoStatus.PLAYING) {
      setIsPlaying(true);
      const fullDuration = await playerRef.current?.getDuration();
      if (fullDuration) {
        setDuration(fullDuration);
      }
    }
    if (state === VideoStatus.PAUSED) {
      setIsPlaying(false);
    }
  }, []);

  const onSlideStart = useCallback(() => {
    setIsSeeking(true);
  }, []);

  const onSlideComplete = useCallback(async (value: number) => {
    playerRef.current?.seekTo(value, true);
    setProgress(value);
    // Timeout to prevent stuttering after seek
    setTimeout(() => setIsSeeking(false), COMMON_NUMBERS.afterSeekTimeout);
  }, []);

  const togglePlaying = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seekBackward = useCallback(() => {
    const newTime = Math.max(0, progress - COMMON_NUMBERS.seekingTime); // Prevents going below 0
    playerRef.current?.seekTo(newTime, true);
    setProgress(newTime);
  }, [progress]);

  const seekForward = useCallback(() => {
    // We can add a check to not seek beyond the duration if we want
    const newTime = progress + COMMON_NUMBERS.seekingTime;
    playerRef.current?.seekTo(newTime, true);
    setProgress(newTime);
  }, [progress]);

  const onLeftDoubleTap = useCallback(
    ({ nativeEvent }: TapGestureHandlerStateChangeEvent) => {
      if (nativeEvent.state === State.ACTIVE) {
        seekBackward();
      }
    },
    [seekBackward]
  );

  const onRightDoubleTap = useCallback(
    ({ nativeEvent }: TapGestureHandlerStateChangeEvent) => {
      if (nativeEvent.state === State.ACTIVE) {
        seekForward();
      }
    },
    [seekForward]
  );

  if (status === StateStatus.LOADING && movies.length === 0) {
    return (
      <View
        style={[
          layout.flex_1,
          layout.itemsCenter,
          layout.justifyCenter,
          backgrounds.black,
          { height: cardHeight },
        ]}
      >
        <Loader size={64} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={[
        layout.flex_1,
        layout.itemsCenter,
        layout.justifyCenter,
        backgrounds.black,
        { height: cardHeight },
      ]}
    >
      <YoutubeIframe
        height={VIDEO_HEIGHT}
        initialPlayerParams={{
          controls: false,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        }}
        onChangeState={onStateChange}
        play={isPlaying}
        ref={playerRef}
        videoId={movie.trailerKey}
        width={VIDEO_WIDTH}
      />

      <View style={[layout.z1, StyleSheet.absoluteFillObject]} />

      <View style={[layout.row, layout.flex_1, StyleSheet.absoluteFillObject]}>
        {/* Left Side for Rewind */}
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={onLeftDoubleTap}
        >
          <Pressable onPress={togglePlaying} style={[layout.flex_1]} />
        </TapGestureHandler>

        {/* Right Side for Forward */}
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={onRightDoubleTap}
        >
          <Pressable onPress={togglePlaying} style={[layout.flex_1]} />
        </TapGestureHandler>
      </View>

      <Pressable
        onPress={togglePlaying}
        style={[
          layout.z1,
          layout.itemsCenter,
          layout.justifyCenter,
          StyleSheet.absoluteFillObject,
        ]}
      >
        {!isPlaying && (
          <GlassmorphicElement
            extraStyles={[gutters.padding_SMALL, borders.rounded_100]}
          >
            <IconByVariant path={ICONS.iconPlay} />
          </GlassmorphicElement>
        )}
      </Pressable>

      <View
        style={[
          layout.absolute,
          layout.left0,
          layout.bottom0,
          layout.right0,
          layout.z10,
          gutters.padding_MEDIUM,
        ]}
      >
        <View style={[gutters.gap_MEDIUM, gutters.marginBottom_LARGE]}>
          <Text style={[fonts.white, fonts.size_LG_BeVietnamProBold]}>
            {movieTitle}
          </Text>

          <View style={[layout.row, layout.itemsStart, gutters.gap_MEDIUM]}>
            <View style={[borders.rounded_8, layout.hideOverflow]}>
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  priority: FastImage.priority.high,
                  uri: moviePoster || "https://via.placeholder.com/500",
                }}
                style={[styles.moviePoster]}
              />
            </View>

            <View style={[layout.flexShrink_1, gutters.gap_SMALL]}>
              <Text
                numberOfLines={4}
                style={[
                  fonts.white,
                  fonts.size_SM_BeVietnamProRegular,
                  layout.lineHeightMD,
                ]}
              >
                {movie.overview}
              </Text>
              <View style={[layout.row, layout.fullWidth, gutters.gap_SMALL]}>
                <Button
                  buttonStyle={[layout.flex_1]}
                  isSecondary
                  title={t("feed:full_screen")}
                />
                <Button
                  buttonStyle={[layout.flex_1]}
                  title={t("feed:see_more")}
                />
              </View>
            </View>
          </View>
        </View>

        <Slider
          maximumTrackTintColor={colors.gray400}
          maximumValue={duration}
          minimumTrackTintColor={colors.primary400}
          minimumValue={0}
          onSlidingComplete={onSlideComplete}
          onSlidingStart={onSlideStart}
          style={[layout.fullWidth]}
          thumbTintColor={colors.primary400}
          value={progress}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  moviePoster: {
    height: verticalScale(132),
    width: moderateScale(88),
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  touchBlocker: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

// memo prevents re-rendering of cards that are not visible
export default memo(TrailerCard);
