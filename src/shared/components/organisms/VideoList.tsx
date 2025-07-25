import type { MovieVideo } from "@/features/movie/models/movie.model";
import { FlashList } from "@shopify/flash-list";
import { VideoCard } from "../molecules";

interface VideoListProps {
  data: MovieVideo[];
  handleNavigateToVideo?: (firstVideo: string) => void;
}

const VideoList = ({
  data,
  handleNavigateToVideo = undefined,
}: VideoListProps) => {
  return (
    <FlashList
      data={data || []}
      keyExtractor={(item: MovieVideo, index: number) =>
        item.id?.toString() || index.toString()
      }
      renderItem={({ index, item }: { index: number; item: MovieVideo }) => {
        return (
          <VideoCard
            onPress={handleNavigateToVideo}
            videoKey={item.key as string}
            videoName={item.name as string}
          />
        );
      }}
    />
  );
};

export default VideoList;
