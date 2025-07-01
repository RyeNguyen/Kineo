import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus, TabCategory, VideoType } from "@/config";
import type { Country, Movie, MovieGenre } from "../models/movie.model";
import { t } from "i18next";
import type { defaultStoreData } from "@/shared";

export interface MovieWithMetadata extends Movie {
  trailerKey?: string;
}

export interface MovieType {
  id: number;
  name: string;
  value: VideoType;
}

export interface MovieScore {
  id: number;
  name: string;
  value: number;
}

export interface MovieVoteCount {
  id: number;
  name: string;
  value: number;
}

export interface MovieState {
  activeTab: TabCategory;
  countries: defaultStoreData<Country[]>;
  filter: {
    country?: string;
    genres: string[];
    score?: MovieScore;
    type: MovieType;
    voteCount?: MovieVoteCount;
    year?: number;
  };
  genres: defaultStoreData<MovieGenre[]>;
  pagination: {
    [key in TabCategory]: {
      currentPage: number;
      error: string;
      fetchedPages: number[];
      movies: MovieWithMetadata[];
      status: StateStatus;
      totalPages: number;
    };
  };
}

const setupInitialPagination = (): MovieState["pagination"] => {
  const pagination = {} as MovieState["pagination"];
  Object.values(TabCategory).forEach((tab) => {
    pagination[tab] = {
      currentPage: 0,
      error: "",
      fetchedPages: [],
      movies: [],
      status: StateStatus.INIT,
      totalPages: 0,
    };
  });
  return pagination;
};

const initialState: MovieState = {
  activeTab: TabCategory.DISCOVER,
  countries: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  filter: {
    genres: [],
    type: {
      id: 1,
      name: t("filter:movies"),
      value: VideoType.MOVIE,
    },
  },
  genres: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  pagination: setupInitialPagination(),
};

const movieSlice = createSlice({
  initialState,
  name: "movie",
  reducers: {
    addFetchedPage: (state, action: PayloadAction<number>) => {
      const currentCategory = state.pagination[state.activeTab];
      if (!currentCategory.fetchedPages.includes(action.payload)) {
        currentCategory.fetchedPages.push(action.payload);
      }
    },
    clearAllMovieState: (state) => {
      state.pagination = initialState.pagination;
    },
    clearFilters: (state) => {
      state.filter = initialState.filter;
    },
    clearMovieState: (state) => {
      Object.assign(state.pagination[state.activeTab], {
        currentPage: 0,
        error: "",
        fetchedPages: [],
        movies: [],
        status: StateStatus.INIT,
        totalPages: 0,
      });
    },
    getCountries: (state) => {
      Object.assign(state.countries, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getCountriesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.countries, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getCountriesSuccess: (state, action: PayloadAction<Country[]>) => {
      Object.assign(state.countries, {
        data: action.payload,
        error: "",
        status: StateStatus.SUCCESS,
      });
    },
    getDiscoveredMovies: (state) => {
      Object.assign(state.pagination[state.activeTab], {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getDiscoveredMoviesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.pagination[state.activeTab], {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getDiscoveredMoviesSuccess: (
      state,
      action: PayloadAction<MovieWithMetadata[]>
    ) => {
      const currentTab = state.pagination[state.activeTab];
      Object.assign(currentTab, {
        error: "",
        movies: [...currentTab.movies, ...action.payload],
        status: StateStatus.SUCCESS,
      });
    },
    getGenres: (state) => {
      Object.assign(state.genres, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getGenresFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.genres, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getGenresSuccess: (state, action: PayloadAction<MovieGenre[]>) => {
      Object.assign(state.genres, {
        data: action.payload,
        error: "",
        status: StateStatus.SUCCESS,
      });
    },
    refreshMovies: (state) => {},
    setActiveTab: (state, action: PayloadAction<TabCategory>) => {
      state.activeTab = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination[state.activeTab].currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.pagination[state.activeTab].totalPages = action.payload;
    },
    updateCountryFilter: (state, action: PayloadAction<string>) => {
      const criteria = state.filter.country;
      const newCountry = action.payload;

      if (criteria && criteria === newCountry) {
        delete state.filter.country;
      } else {
        state.filter.country = action.payload;
      }
    },
    updateGenresFilter: (state, action: PayloadAction<MovieGenre>) => {
      let criteria = state.filter.genres;
      const newGenre = action.payload;

      if (criteria.some((el: string) => el === newGenre.id?.toString())) {
        criteria = criteria.filter(
          (el: string) => el !== newGenre.id?.toString()
        );
      } else {
        criteria.push(newGenre.id?.toString() as string);
      }

      Object.assign(state.filter, { genres: criteria });
    },
    updateScoreFilter: (state, action: PayloadAction<MovieScore>) => {
      const criteria = state.filter.score;
      const newScore = action.payload;

      if (criteria && criteria.value === newScore.value) {
        delete state.filter.score;
      } else {
        state.filter.score = action.payload;
      }
    },
    updateTypeFilter: (state, action: PayloadAction<MovieType>) => {
      state.filter.type = action.payload;
    },
    updateVoteCountFilter: (state, action: PayloadAction<MovieVoteCount>) => {
      const criteria = state.filter.voteCount;
      const newVoteCount = action.payload;

      if (criteria && criteria.value === newVoteCount.value) {
        delete state.filter.voteCount;
      } else {
        state.filter.voteCount = action.payload;
      }
    },
    updateYearFilter: (state, action: PayloadAction<number>) => {
      const criteria = state.filter.year;
      const newYear = action.payload;

      if (criteria && criteria === newYear) {
        delete state.filter.year;
      } else {
        state.filter.year = action.payload;
      }
    },
  },
});

export const {
  addFetchedPage,
  clearAllMovieState,
  clearFilters,
  clearMovieState,
  getCountries,
  getCountriesFailure,
  getCountriesSuccess,
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getGenres,
  getGenresFailure,
  getGenresSuccess,
  refreshMovies,
  setActiveTab,
  setCurrentPage,
  setTotalPages,
  updateCountryFilter,
  updateGenresFilter,
  updateScoreFilter,
  updateTypeFilter,
  updateVoteCountFilter,
  updateYearFilter,
} = movieSlice.actions;
export default movieSlice.reducer;
