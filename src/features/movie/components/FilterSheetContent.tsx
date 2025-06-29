// src/screens/FeedScreen/FilterSheetContent.tsx

import { Button } from "@/shared/components/atoms";
import { useTheme } from "@/shared/hook";
import { t } from "i18next";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { MovieScore, MovieState, MovieType } from "../store/movieSlice";
import { updateMovieFilters } from "../store/movieSlice";
import { VideoType } from "@/config";
// import { applyFilters, clearMoviesState } from '@/features/movie/store/movieSlice';

// For simplicity, let's hardcode some genres.
// In a real app, you would fetch these from the TMDB /genre/movie/list endpoint.
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
];

const MOVIE_TYPES: MovieType[] = [
  {
    id: 1,
    name: t("filter:movies"),
    value: VideoType.MOVIE,
  },
  {
    id: 2,
    name: t("filter:tv_shows"),
    value: VideoType.TV,
  },
];

const MOVIE_SCORES: MovieScore[] = [
  {
    id: 1,
    name: "8+",
    value: 8,
  },
  {
    id: 2,
    name: "7+",
    value: 7,
  },
  {
    id: 3,
    name: "6+",
    value: 6,
  },
];

interface FilterSheetContentProps {
  onClose: () => void;
}

const FilterSheetContent = ({ onClose }: FilterSheetContentProps) => {
  const { backgrounds, borders, colors, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { filter } = useSelector((state: { movie: MovieState }) => state.movie);
  const { score, type } = filter;

  // State to hold the user's selections within the sheet
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const handleGenrePress = useCallback((genreId: number) => {
    setSelectedGenres(
      (prev) =>
        prev.includes(genreId)
          ? prev.filter((id) => id !== genreId) // Deselect if already selected
          : [...prev, genreId] // Select if not already selected
    );
  }, []);

  const handleApplyFilters = () => {
    // Dispatch actions to apply filters and close the sheet
    // dispatch(clearMoviesState());
    // dispatch(applyFilters({ genres: selectedGenres }));
    onClose();
  };

  return (
    <View style={[layout.flex_1, gutters.gap_MEDIUM]}>
      <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          {t("filter:types")}
        </Text>

        <View style={[layout.row, gutters.gap_SMALL]}>
          {MOVIE_TYPES.map((movType: MovieType, index: number) => {
            const isSelected = movType.value === type.value;

            return (
              <View key={movType.id || index} style={[layout.flex_1]}>
                <Button
                  buttonStyle={[
                    isSelected ? borders.primary400 : borders.gray100,
                    borders.w_1,
                    backgrounds.transparent,
                  ]}
                  buttonTextStyle={[
                    isSelected ? fonts.primary400 : fonts.gray100,
                    fonts.size_SM_BeVietnamProRegular,
                  ]}
                  onPress={() =>
                    dispatch(updateMovieFilters({ type: movType }))
                  }
                  title={movType.name}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          {t("filter:voting_score")}
        </Text>

        <View style={[layout.row, gutters.gap_SMALL]}>
          {MOVIE_SCORES.map((movScore: MovieScore, index: number) => {
            const isSelected = movScore.value === score?.value;

            return (
              <View key={movScore.id || index} style={[layout.flex_1]}>
                <Button
                  buttonStyle={[
                    isSelected ? borders.primary400 : borders.gray100,
                    borders.w_1,
                    backgrounds.transparent,
                  ]}
                  buttonTextStyle={[
                    isSelected ? fonts.primary400 : fonts.gray100,
                    fonts.size_SM_BeVietnamProRegular,
                  ]}
                  onPress={() =>
                    dispatch(updateMovieFilters({ score: movScore }))
                  }
                  title={movScore.name}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          Genres
        </Text>

        <View style={[layout.row, layout.wrap, gutters.gap_SMALL]}>
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return <Button title={genre.name} />;
          })}
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  genreChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default FilterSheetContent;
