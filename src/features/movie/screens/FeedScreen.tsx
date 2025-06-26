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
  const { movies } = useSelector((state: { movie: MovieState }) => state.movie);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);

  useEffect(() => {
    if (movies.data.length === 0) {
      dispatch(getDiscoveredMovies());
    }
  }, [dispatch, movies.data.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleItemIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleLoadMore = () => {
    // Prevent multiple requests while one is already pending
    if (movies.status !== StateStatus.LOADING) {
      dispatch(getDiscoveredMovies());
    }
  };

  if (movies.status === StateStatus.LOADING && movies.data.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <SafeScreen>
      <FlatList
        data={movies.data}
        // estimatedItemSize={DEVICE_SIZE.height}
        initialNumToRender={3}
        keyExtractor={(item: MovieWithMetadata, index: number) =>
          (item.id || index).toString()
        }
        ListFooterComponent={() => {
          return movies.status === StateStatus.LOADING ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : null;
        }}
        maxToRenderPerBatch={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        // These help with performance
        removeClippedSubviews={true}
        renderItem={({ index, item }) => (
          <TrailerCard isPaused={index !== visibleItemIndex} movie={item} />
        )}
        showsVerticalScrollIndicator={false}
        style={[layout.flex_1]}
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
