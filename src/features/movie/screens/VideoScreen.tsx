import type { Paths } from "@/navigation/paths";
import { SafeScreen, TrailerCard } from "@/shared/components/molecules";
import { useTheme } from "@/shared/hook";
import type { RootScreenProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import type { MovieWithMetadata } from "../store/movieSlice";
import { Loader } from "@/shared/components/atoms";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import type { MovieVideo } from "../models/movie.model";

const VideoScreen = ({ route }: RootScreenProps<Paths.Video>) => {
  const { firstVideo, movie } = route.params;

  const { backgrounds, layout } = useTheme();

  const data = useMemo(() => {
    // Exclude the 'videos' array from the main movie object to avoid redundant data in each item.
    const { videos, ...movieWithoutVideos } = movie;
    return (videos || []).map((item: MovieVideo) => {
      return {
        ...movieWithoutVideos,
        trailerKey: item.key,
      };
    });
  }, [movie]);

  const initialScrollIndex = useMemo(() => {
    const index = data.findIndex((item) => item.trailerKey === firstVideo);
    // If the video is not found, default to the first one.
    return index > -1 ? index : 0;
  }, [data, firstVideo]);

  const [visibleItemIndex, setVisibleItemIndex] =
    useState<number>(initialScrollIndex);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: null | number }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setVisibleItemIndex(viewableItems[0].index!);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setLayoutHeight(height);
  };

  return (
    <SafeScreen onLayout={onLayout} style={[backgrounds.black]}>
      {layoutHeight > 0 ? (
        <FlashList
          data={data}
          estimatedItemSize={layoutHeight}
          extraData={visibleItemIndex}
          initialScrollIndex={initialScrollIndex}
          keyExtractor={(item: MovieWithMetadata, index: number) =>
            (item.trailerKey || index).toString()
          }
          ListFooterComponent={
            data.length === 0 ? (
              <View
                style={[
                  layout.itemsCenter,
                  layout.justifyCenter,
                  { height: layoutHeight },
                ]}
              >
                <Loader size={64} />
              </View>
            ) : null
          }
          onViewableItemsChanged={onViewableItemsChanged}
          pagingEnabled
          removeClippedSubviews={true}
          renderItem={({
            index,
            item,
          }: {
            index: number;
            item: MovieWithMetadata;
          }) => (
            <TrailerCard
              cardHeight={layoutHeight}
              hasDetails={false}
              isPaused={index !== visibleItemIndex}
              movie={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
        />
      ) : (
        <View style={[layout.flex_1, layout.itemsCenter, layout.justifyCenter]}>
          <Loader size={64} />
        </View>
      )}
    </SafeScreen>
  );
};

export default VideoScreen;
