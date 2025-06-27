/* eslint-disable import/no-extraneous-dependencies */
import type {
  MovieState,
  MovieWithMetadata,
} from "@/features/movie/store/movieSlice";
import { COMMON_NUMBERS, DEVICE_SIZE, StateStatus } from "@/shared/constant";
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
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { moderateScale, verticalScale } from "@/shared/utils";

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
  const { backgrounds, borders, fonts, gutters, layout } = useTheme();

  const { activeTab, pagination } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  const { movies, status } = pagination[activeTab];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  const needsTruncation =
    (movie.overview || []).length > COMMON_NUMBERS.overviewCharacterLimit;

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
      }, 500); // Poll every 500ms
    }

    // Cleanup function that clears the interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isSeeking]);

  const movieTitle = useMemo(() => {
    return `${movie.title} (${getYear(movie.release_date || Date.now().toString())})`;
  }, [movie.title, movie.release_date]);

  const movieOverview = useMemo(() => {
    if (!needsTruncation || isExpanded) {
      return movie.overview;
    }
    // If it's collapsed and needs truncation, shorten it and add an ellipsis.
    return `${(movie.overview || []).slice(0, COMMON_NUMBERS.overviewCharacterLimit)}... `;
  }, [movie.overview, needsTruncation, isExpanded]);

  const moviePoster = useMemo(() => {
    if (!movie.poster_path) {
      return null;
    }
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }, [movie.poster_path]);

  const onStateChange = useCallback(async (state: string) => {
    if (state === "ended") {
      setIsPlaying(false);
      setProgress(0);
      playerRef.current?.seekTo(0, true);
    }
    if (state === "playing") {
      setIsPlaying(true);
      const fullDuration = await playerRef.current?.getDuration();
      if (fullDuration) {
        setDuration(fullDuration);
      }
    }
    if (state === "paused") {
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
    setTimeout(() => setIsSeeking(false), 500);
  }, []);

  const toggleIsExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (status === StateStatus.LOADING && movies.length === 0) {
    return (
      <View
        style={[
          layout.flex_1,
          layout.itemsCenter,
          layout.justifyCenter,
          backgrounds.black,
          { height: cardHeight },
          styles.loaderContainer,
        ]}
      >
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

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

      <View style={styles.touchBlocker} />

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
        <View style={[layout.row, layout.itemsEnd, gutters.gap_MEDIUM]}>
          <View style={[borders.roundedTop_8, layout.hideOverflow]}>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={{
                priority: FastImage.priority.high,
                uri: moviePoster || "https://via.placeholder.com/500",
              }}
              style={[styles.moviePoster]}
            />
          </View>

          <View
            style={[layout.itemsStart, layout.flexShrink_1, gutters.gap_TINY]}
          >
            <Text style={[fonts.white, fonts.size_LG_BeVietnamProBold]}>
              {movieTitle}
            </Text>

            <Pressable onPress={toggleIsExpanded}>
              <Text style={[fonts.white, fonts.size_SM_BeVietnamProRegular]}>
                {movieOverview}
                {needsTruncation && (
                  <Text style={[fonts.size_SM_BeVietnamProBold]}>
                    {isExpanded ? ` ${t("feed:less")}` : ` ${t("feed:more")}`}
                  </Text>
                )}
              </Text>
            </Pressable>
          </View>
        </View>

        <Slider
          maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
          maximumValue={duration}
          minimumTrackTintColor="#FFFFFF"
          minimumValue={0}
          onSlidingComplete={onSlideComplete}
          onSlidingStart={onSlideStart}
          style={styles.slider}
          thumbTintColor="#FFFFFF"
          value={progress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  moviePoster: {
    height: verticalScale(150),
    width: moderateScale(100),
  },
  slider: {
    height: 40,
    marginTop: 10,
    width: "100%",
  },
  touchBlocker: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

// memo prevents re-rendering of cards that are not visible
export default memo(TrailerCard);
