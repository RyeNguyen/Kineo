/* eslint-disable import/no-extraneous-dependencies */
import type { MovieWithMetadata } from "@/features/movie/store/movieSlice";
import { COMMON_NUMBERS, DEVICE_SIZE } from "@/shared/constant";
import { useTheme } from "@/shared/hook";
import React, { memo } from "react";
import { Text, View } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

interface TrailerCardProps {
  isPaused: boolean;
  movie: MovieWithMetadata;
  onStateChange: (state: string) => void;
}

const VIDEO_WIDTH = Math.min(DEVICE_SIZE.width, 400);
const VIDEO_HEIGHT = VIDEO_WIDTH / COMMON_NUMBERS.youtubeAspectRatio;

const TrailerCard = ({ isPaused, movie, onStateChange }: TrailerCardProps) => {
  const { backgrounds, fonts, gutters, layout } = useTheme();

  return (
    <View
      style={[
        layout.flex_1,
        layout.itemsCenter,
        layout.justifyCenter,
        backgrounds.black,
        { height: DEVICE_SIZE.height, borderWidth: 2, borderColor: "red" },
      ]}
    >
      <YoutubeIframe
        height={VIDEO_HEIGHT}
        initialPlayerParams={{
          controls: false,
          loop: true,
          modestbranding: 1,
          playlist: movie.trailerKey,
          rel: 0,
          showinfo: 0,
        }}
        onChangeState={onStateChange}
        play={!isPaused}
        videoId={movie.trailerKey}
        width={VIDEO_WIDTH}
      />

      <View
        style={[
          layout.absolute,
          layout.left0,
          layout.bottom0,
          layout.itemsStart,
          gutters.gap_TINY,
        ]}
      >
        <Text style={[fonts.white]}>{movie.title}</Text>
        <Text style={[fonts.white]}>{movie.overview}</Text>
      </View>
    </View>
  );
};

// memo prevents re-rendering of cards that are not visible
export default memo(TrailerCard);
