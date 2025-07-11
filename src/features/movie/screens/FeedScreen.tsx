import type { LayoutChangeEvent } from "react-native";
import { Pressable, RefreshControl, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Paths } from "@/navigation/paths";
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
  clearAllMovieState,
  clearFilters,
  getCountries,
  getDiscoveredMovies,
  getGenres,
  refreshMovies,
  setActiveTab,
} from "@/features/movie/store/movieSlice";
import { StateStatus } from "@/config";
import type { TabCategory } from "@/shared/constant";
import { DEVICE_SIZE, ICONS } from "@/shared/constant";
import { Button, IconByVariant, Loader } from "@/shared/components/atoms";
import type { BaseBottomSheetRef } from "@/shared/components/atoms/BaseBottomSheet";
import BaseBottomSheet from "@/shared/components/atoms/BaseBottomSheet";
import FilterSheetContent from "../components/FilterSheetContent";
import { t } from "i18next";
import type { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

function FeedScreen({ navigation }: RootScreenProps<Paths.Feed>) {
  const { backgrounds, colors, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { activeTab, countries, genres, pagination } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  // console.log("🚀 ~ FeedScreen ~ pagination:", pagination);
  const { fetchedPages, movies, status, totalPages } = pagination[activeTab];

  const [visibleItemIndex, setVisibleItemIndex] = useState<number>(0);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const [shouldReopenFilter, setShouldReopenFilter] = useState<boolean>(false);

  const filterSheetRef = useRef<BaseBottomSheetRef>(null);

  const isRefreshing = status === StateStatus.LOADING && movies.length > 0;

  useFocusEffect(
    useCallback(() => {
      if (shouldReopenFilter) {
        filterSheetRef.current?.onExpand();
        setShouldReopenFilter(false);
      }
    }, [shouldReopenFilter])
  );

  useEffect(() => {
    if (!movies.length) {
      dispatch(getDiscoveredMovies());
    }

    if (!genres.data.length) {
      dispatch(getGenres());
    }

    if (!countries.data.length) {
      dispatch(getCountries());
    }
  }, [countries.data.length, dispatch, genres.data.length, movies.length]);

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
    if (status !== StateStatus.LOADING && fetchedPages.length < totalPages) {
      dispatch(getDiscoveredMovies());
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(refreshMovies());
  }, [dispatch]);

  const handleOpenFilters = useCallback(() => {
    filterSheetRef.current?.onExpand();
  }, []);

  const handleCloseFilters = useCallback(() => {
    filterSheetRef.current?.close();
  }, []);

  const handleNavigateToDetail = useCallback(
    ({ movieId, trailerKey }: { movieId: number; trailerKey: string }) => {
      navigation.navigate(Paths.MovieDetail, { movieId, trailerKey });
    },
    [navigation]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearAllMovieState());
    dispatch(clearFilters());
    dispatch(getDiscoveredMovies());
    filterSheetRef.current?.close();
  }, [dispatch]);

  const handleApplyFilters = useCallback(() => {
    dispatch(clearAllMovieState());
    dispatch(getDiscoveredMovies());
    filterSheetRef.current?.close();
  }, [dispatch]);

  const handleNavigateToCountryPicker = useCallback(() => {
    setShouldReopenFilter(true);
    filterSheetRef.current?.close();
    navigation.navigate(Paths.SelectCountry);
  }, [navigation]);

  const renderBottomSheetFooter = useCallback(
    (props: BottomSheetDefaultFooterProps & React.JSX.IntrinsicAttributes) => {
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View
            style={[
              backgrounds.gray800,
              layout.row,
              layout.fullWidth,
              layout.itemsCenter,
              gutters.gap_LARGE,
              gutters.padding_MEDIUM,
            ]}
          >
            <Pressable onPress={handleClearFilters}>
              <Text
                style={[fonts.size_SM_BeVietnamProSemiBold, fonts.primary400]}
              >
                {t("filter:clear")}
              </Text>
            </Pressable>

            <View style={[layout.flex_1]}>
              <Button
                buttonStyle={[
                  gutters.paddingTop_SMALL,
                  gutters.paddingBottom_MEDIUM,
                ]}
                onPress={handleApplyFilters}
                title={t("filter:apply")}
              />
            </View>
          </View>
        </BottomSheetFooter>
      );
    },
    [
      backgrounds.gray800,
      fonts.primary400,
      fonts.size_SM_BeVietnamProSemiBold,
      gutters.gap_LARGE,
      gutters.paddingBottom_MEDIUM,
      gutters.paddingTop_SMALL,
      gutters.padding_MEDIUM,
      handleApplyFilters,
      handleClearFilters,
      layout.flex_1,
      layout.fullWidth,
      layout.itemsCenter,
      layout.row,
    ]
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setLayoutHeight(height);
  };

  return (
    <SafeScreen onLayout={onLayout} style={[backgrounds.black]}>
      {layoutHeight > 0 && (
        <FlashList
          data={movies}
          estimatedItemSize={DEVICE_SIZE.height}
          extraData={visibleItemIndex}
          keyExtractor={(item: MovieWithMetadata, index: number) =>
            (item.id || index).toString()
          }
          ListFooterComponent={
            movies.length === 0 ? (
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          onRefresh={handleRefresh}
          onViewableItemsChanged={onViewableItemsChanged}
          pagingEnabled
          refreshControl={
            <RefreshControl
              colors={[colors.primary400]} // For Android, makes the spinner white
              onRefresh={handleRefresh}
              progressBackgroundColor={colors.gray800}
              refreshing={isRefreshing}
              tintColor={colors.primary400} // For iOS, makes the spinner white
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
              onNavigateToDetail={handleNavigateToDetail}
            />
          )}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
        />
      )}

      <View
        style={[
          layout.row,
          layout.itemsCenter,
          layout.absolute,
          layout.left0,
          layout.right0,
          layout.z10,
          gutters.gap_LARGE,
          gutters.paddingHorizontal_MEDIUM,
          gutters.paddingTop_XLARGE,
        ]}
      >
        <FeedTabs activeTab={activeTab} onTabPress={handleTabPress} />
        <Pressable onPress={handleOpenFilters}>
          <IconByVariant path={ICONS.iconFilter} />
        </Pressable>
      </View>

      <BaseBottomSheet
        onClose={handleCloseFilters}
        ref={filterSheetRef}
        renderFooterModal={renderBottomSheetFooter}
        scrollEnable
        snapPoints={["90%"]}
        style={[backgrounds.gray800]}
      >
        {/* The content of the sheet will be a new component */}
        <FilterSheetContent
          onNavigateToCountryPicker={handleNavigateToCountryPicker}
        />
      </BaseBottomSheet>
    </SafeScreen>
  );
}

export default FeedScreen;
