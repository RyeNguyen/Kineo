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
    // countries?: Country[];
    genres: string[];
    score?: MovieScore;
    type: MovieType;
    voteCount?: MovieVoteCount;
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
      Object.assign(state.pagination, initialState.pagination);
    },
    clearFilters: (state) => {
      Object.assign(state.filter, initialState.filter);
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
    updateMovieFilters: (
      state,
      action: PayloadAction<
        Record<string, MovieGenre | MovieScore | MovieType | MovieVoteCount>
      >
    ) => {
      Object.keys(action.payload).forEach((key: string) => {
        const filterKey = key as keyof typeof state.filter;
        const newFilter = action.payload[filterKey];

        switch (filterKey) {
          case "genres": {
            let criteria = state.filter[filterKey];

            if (
              criteria.some((el: string) => el === newFilter.id?.toString())
            ) {
              criteria = criteria.filter(
                (el: string) => el !== newFilter.id?.toString()
              );
            } else {
              criteria.push(newFilter.id?.toString() as string);
            }
            Object.assign(state.filter, { genres: criteria });
            break;
          }
          case "score":
          case "voteCount": {
            const criteria = state.filter[filterKey];

            if (
              criteria &&
              "value" in newFilter &&
              typeof criteria !== "string" &&
              criteria.value === newFilter.value
            ) {
              delete state.filter[filterKey];
            } else {
              Object.assign(state.filter, action.payload);
            }
            break;
          }
          case "type":
          default: {
            {
              Object.assign(state.filter, action.payload);
              break;
            }
          }
        }
      });
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
  updateMovieFilters,
} = movieSlice.actions;
export default movieSlice.reducer;
