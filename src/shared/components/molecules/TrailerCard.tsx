import { DEVICE_SIZE } from "@/shared/constant";
import { useTheme } from "@/shared/hook";
import React, { memo } from "react";
import { View } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";

interface Props {
  isPaused: boolean;
  onStateChange: (state: string) => void;
  trailerKey: string;
}

const YOUTUBE_ASPECT_RATIO = 16 / 9;
const VIDEO_WIDTH = Math.min(DEVICE_SIZE.width, 400); // or any max width you want
const VIDEO_HEIGHT = VIDEO_WIDTH / YOUTUBE_ASPECT_RATIO;

const TrailerCard = ({ isPaused, onStateChange, trailerKey }: Props) => {
  const { backgrounds, layout } = useTheme();

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
          controls: false, // Hide the controls
          loop: true, // Loop the video
        }}
        onChangeState={onStateChange}
        play={!isPaused}
        videoId={trailerKey}
        width={VIDEO_WIDTH}
      />
    </View>
  );
};

// memo prevents re-rendering of cards that are not visible
export default memo(TrailerCard);
