// src/screens/FeedScreen/FilterSheetContent.tsx

import { Button } from "@/shared/components/atoms";
import { useTheme } from "@/shared/hook";
import { t } from "i18next";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type {
  MovieScore,
  MovieState,
  MovieType,
  MovieVoteCount,
} from "../store/movieSlice";
import { getGenres, updateMovieFilters } from "../store/movieSlice";
import { VideoType } from "@/config";
import type { MovieGenre } from "../models/movie.model";

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

const MOVIE_VOTE_COUNTS: MovieVoteCount[] = [
  {
    id: 1,
    name: "10,000+",
    value: 10_000,
  },
  {
    id: 2,
    name: "5,000+",
    value: 5000,
  },
  {
    id: 3,
    name: "1,000+",
    value: 1000,
  },
  {
    id: 4,
    name: "500+",
    value: 500,
  },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYear - 1999 },
  (_, i) => currentYear - i
);

interface FilterSheetContentProps {
  onClose: () => void;
}

const FilterSheetContent = ({ onClose }: FilterSheetContentProps) => {
  const { backgrounds, borders, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { countries, filter, genres } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );
  const { genres: filterGenres, score, type, voteCount, year } = filter;

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch, type.id]);

  return (
    <View style={[layout.flex_1, gutters.gap_MEDIUM]}>
      {/* Movie Type */}
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

      {/* Voting Scores */}
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

      {/* Total Votes */}
      <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          {t("filter:total_votes")}
        </Text>

        <View style={[layout.row, gutters.gap_SMALL]}>
          {MOVIE_VOTE_COUNTS.map(
            (movVoteCount: MovieVoteCount, index: number) => {
              const isSelected = movVoteCount.value === voteCount?.value;

              return (
                <View key={movVoteCount.id || index} style={[layout.flex_1]}>
                  <Button
                    buttonStyle={[
                      isSelected ? borders.primary400 : borders.gray100,
                      borders.w_1,
                      backgrounds.transparent,
                      gutters.paddingHorizontal_ZERO,
                    ]}
                    buttonTextStyle={[
                      isSelected ? fonts.primary400 : fonts.gray100,
                      fonts.size_SM_BeVietnamProRegular,
                    ]}
                    onPress={() =>
                      dispatch(updateMovieFilters({ voteCount: movVoteCount }))
                    }
                    title={movVoteCount.name}
                  />
                </View>
              );
            }
          )}
        </View>
      </View>

      {/* Years */}
      <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          {t("filter:years")}
        </Text>

        <ScrollView horizontal>
          <View style={[layout.row, gutters.gap_SMALL]}>
            {YEARS.map((movYear: number, index: number) => {
              const isSelected = movYear === year;

              return (
                <View key={movYear || index}>
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
                      dispatch(updateMovieFilters({ year: movYear }))
                    }
                    title={movYear.toString()}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Genres */}
      <View style={gutters.gap_SMALL}>
        <Text
          style={[
            fonts.size_SM_BeVietnamProSemiBold,
            fonts.white,
            layout.lineHeightMD,
          ]}
        >
          {t("filter:genres")}
        </Text>

        <View style={[layout.row, layout.wrap, gutters.gap_SMALL]}>
          {genres.data.map((movGenre: MovieGenre, index: number) => {
            const isSelected = filterGenres.includes(
              movGenre.id?.toString() as string
            );

            return (
              <View key={movGenre.id || index}>
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
                    dispatch(updateMovieFilters({ genres: movGenre }))
                  }
                  title={movGenre.name}
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

export default FilterSheetContent;
