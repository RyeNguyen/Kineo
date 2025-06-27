import type { LayoutChangeEvent } from "react-native";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

import type { Paths } from "@/navigation/paths";
import useTheme from "@/shared/hook/useTheme";
import {
  FeedTabs,
  SafeScreen,
  TrailerCard,
} from "@/shared/components/molecules";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RootScreenProps } from "@/types";
import type {
  MovieState,
  MovieWithMetadata,
} from "@/features/movie/store/movieSlice";
import {
  getDiscoveredMovies,
  refreshMovies,
  setActiveTab,
} from "@/features/movie/store/movieSlice";
import { StateStatus } from "@/config";
import type { TabCategory } from "@/shared/constant";
import { DEVICE_SIZE } from "@/shared/constant";

function FeedScreen({ navigation }: RootScreenProps<Paths.Feed>) {
  const { backgrounds, components, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { activeTab, pagination } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  console.log("🚀 ~ FeedScreen ~ pagination:", pagination);
  const { movies, status } = pagination[activeTab];

  const [visibleItemIndex, setVisibleItemIndex] = useState<number>(0);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);

  const isRefreshing = status === StateStatus.LOADING && movies.length > 0;

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(getDiscoveredMovies());
    }
  }, [dispatch, movies.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleItemIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleTabPress = useCallback(
    (tab: TabCategory) => {
      if (tab !== activeTab) {
        dispatch(setActiveTab(tab));
        dispatch(getDiscoveredMovies());
      }
    },
    [activeTab, dispatch]
  );

  const handleLoadMore = () => {
    // Prevent multiple requests while one is already pending
    if (status !== StateStatus.LOADING) {
      dispatch(getDiscoveredMovies());
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(refreshMovies());
  }, [dispatch]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setLayoutHeight(height);
  };

  return (
    <SafeScreen onLayout={onLayout} style={[backgrounds.black]}>
      <FlashList
        data={movies}
        estimatedItemSize={DEVICE_SIZE.height}
        extraData={visibleItemIndex}
        keyExtractor={(item: MovieWithMetadata, index: number) =>
          (item.id || index).toString()
        }
        ListFooterComponent={() => {
          return status === StateStatus.LOADING ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : null;
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        onRefresh={handleRefresh}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        refreshControl={
          <RefreshControl
            colors={["#FFFFFF"]} // For Android, makes the spinner white
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            tintColor="#FFFFFF" // For iOS, makes the spinner white
          />
        }
        refreshing={isRefreshing}
        // These help with performance
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
            isPaused={index !== visibleItemIndex}
            movie={item}
          />
        )}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />

      <View
        style={[
          layout.absolute,
          layout.left0,
          layout.right0,
          layout.z10,
          gutters.padding_MEDIUM,
        ]}
      >
        <FeedTabs activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeScreen>
  );
}

export default FeedScreen;
