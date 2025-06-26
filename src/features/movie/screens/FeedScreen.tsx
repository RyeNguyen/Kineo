import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

import type { Paths } from "@/navigation/paths";
import useTheme from "@/shared/hook/useTheme";
import { SafeScreen, TrailerCard } from "@/shared/components/molecules";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RootScreenProps } from "@/types";
import type {
  MovieState,
  MovieWithMetadata,
} from "@/features/movie/store/movieSlice";
import { getDiscoveredMovies } from "@/features/movie/store/movieSlice";
import { StateStatus } from "@/config";
import { DEVICE_SIZE } from "@/shared/constant";

function FeedScreen({ navigation }: RootScreenProps<Paths.Feed>) {
  const { backgrounds, components, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { discoveries } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);

  useEffect(() => {
    dispatch(getDiscoveredMovies());
  }, [dispatch]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleItemIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (
    discoveries.status === StateStatus.LOADING &&
    discoveries.data.length === 0
  ) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <SafeScreen>
      <FlatList
        data={discoveries.data}
        // estimatedItemSize={DEVICE_SIZE.height}
        initialNumToRender={3}
        keyExtractor={(item: MovieWithMetadata, index: number) =>
          (item.id || index).toString()
        }
        maxToRenderPerBatch={3}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        // These help with performance
        removeClippedSubviews={true}
        renderItem={({ index, item }) => (
          <TrailerCard
            isPaused={index !== visibleItemIndex}
            movie={item}
            onStateChange={(state) => {
              if (state === "ended") {
                console.log("Video ended");
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={[layout.flex_1, { borderWidth: 2, borderColor: "#fff" }]}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  loaderContainer: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
});

export default FeedScreen;
