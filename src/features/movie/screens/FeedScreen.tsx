import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Paths } from "@/navigation/paths";
import useTheme from "@/shared/hook/useTheme";
import { SafeScreen, TrailerCard } from "@/shared/components/molecules";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RootScreenProps } from "@/types";
import type { MovieState } from "@/features/movie/store/movieSlice";
import { getDiscoveredMovies } from "@/features/movie/store/movieSlice";
import { StateStatus } from "@/config";

function FeedScreen({ navigation }: RootScreenProps<Paths.Feed>) {
  const { backgrounds, components, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { discoveries } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  console.log("🚀 ~ StartupScreen ~ discoveries:", discoveries);
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
        initialNumToRender={3}
        keyExtractor={(item) => item.id.toString()}
        maxToRenderPerBatch={3}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled // This is the key for the swipe effect
        // These help with performance
        removeClippedSubviews={true}
        renderItem={({ index, item }) => (
          <TrailerCard
            isPaused={index !== visibleItemIndex}
            onStateChange={(state) => {
              if (state === "ended") {
                console.log("Video ended");
              }
            }}
            trailerKey={item.trailerKey!}
          />
        )}
        showsVerticalScrollIndicator={false}
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
