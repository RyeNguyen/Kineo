import { YouTubeEndPoint } from "@/config";
import { VIDEO_HEIGHT, VIDEO_THUMBNAIL_QUALITIES } from "@/shared/constant";
import { useTheme } from "@/shared/hook";
import { interpolateString } from "@/shared/utils/stringHelper";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

interface VideoCardProps {
  videoKey: string;
  videoName: string;
}

const VideoCard = ({ videoKey, videoName }: VideoCardProps) => {
  const { borders, fonts, gutters, layout } = useTheme();

  const [currentQuality, setCurrentQuality] = useState<string>(
    VIDEO_THUMBNAIL_QUALITIES[0]
  );

  const handleImageError = useCallback(() => {
    const currentIndex = VIDEO_THUMBNAIL_QUALITIES.indexOf(currentQuality);
    if (currentIndex < VIDEO_THUMBNAIL_QUALITIES.length - 1) {
      setCurrentQuality(VIDEO_THUMBNAIL_QUALITIES[currentIndex + 1]);
    }
  }, [currentQuality]);

  return (
    <TouchableOpacity style={[gutters.gap_SMALL, gutters.marginBottom_LARGE]}>
      <FastImage
        onError={handleImageError}
        resizeMode={FastImage.resizeMode.cover}
        source={{
          priority: FastImage.priority.high,
          uri: interpolateString(YouTubeEndPoint.IMAGE, {
            videoKey,
            videoQuality: currentQuality,
          }),
        }}
        style={[
          borders.rounded_16,
          layout.hideOverflow,
          {
            height: VIDEO_HEIGHT,
            width: "100%",
          },
        ]}
      />

      <Text
        style={[
          fonts.white,
          fonts.size_SM_BeVietnamProRegular,
          layout.lineHeightMD,
        ]}
      >
        {videoName}
      </Text>
    </TouchableOpacity>
  );
};

export default VideoCard;
