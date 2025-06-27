/* eslint-disable import/no-extraneous-dependencies */
import type { MovieWithMetadata } from "@/features/movie/store/movieSlice";
import { COMMON_NUMBERS, DEVICE_SIZE } from "@/shared/constant";
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

interface TrailerCardProps {
  isPaused: boolean;
  movie: MovieWithMetadata;
}

const VIDEO_WIDTH = Math.min(DEVICE_SIZE.width, COMMON_NUMBERS.maxVideoWidth);
const VIDEO_HEIGHT = VIDEO_WIDTH / COMMON_NUMBERS.youtubeAspectRatio;

const TrailerCard = ({ isPaused, movie }: TrailerCardProps) => {
  const { backgrounds, fonts, gutters, layout } = useTheme();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const needsTruncation =
    (movie.overview || []).length > COMMON_NUMBERS.overviewCharacterLimit;

  const playerRef = useRef<typeof YoutubeIframe>(null);

  useEffect(() => {
    if (!isPaused) {
      // If the video is NOT paused (i.e., it just became the active video),
      // command it to restart from the beginning.
      playerRef.current?.seekTo(0, true);
    }
  }, [isPaused]);

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

  const onStateChange = useCallback((state: string) => {
    // When the video ends, seek back to the start
    if (state === "ended") {
      playerRef.current?.seekTo(0, true); // seekTo(seconds, allowSeekAhead)
    }
  }, []);

  const toggleIsExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View
      style={[
        layout.flex_1,
        layout.itemsCenter,
        layout.justifyCenter,
        backgrounds.black,
        { height: DEVICE_SIZE.height },
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
        play={!isPaused}
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
          layout.itemsStart,
          layout.z10,
          gutters.gap_TINY,
          gutters.padding_MEDIUM,
        ]}
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
  );
};

const styles = StyleSheet.create({
  touchBlocker: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

// memo prevents re-rendering of cards that are not visible
export default memo(TrailerCard);
