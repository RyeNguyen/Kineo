import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus, TabCategory, VideoType } from "@/config";
import type { Movie } from "../models/movie.model";
import { t } from "i18next";

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

export interface MovieState {
  activeTab: TabCategory;
  filter: {
    score?: MovieScore;
    type: MovieType;
  };
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
  filter: {
    type: {
      id: 1,
      name: t("filter:movies"),
      value: VideoType.MOVIE,
    },
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
      action: PayloadAction<Record<string, MovieScore | MovieType>>
    ) => {
      Object.keys(action.payload).forEach((key: string) => {
        const filterKey = key as keyof typeof state.filter;

        if (key !== "type") {
          if (
            state.filter[filterKey] &&
            state.filter[filterKey]?.value === action.payload[filterKey].value
          ) {
            delete state.filter[filterKey];
          } else {
            Object.assign(state.filter, action.payload);
          }
        } else {
          Object.assign(state.filter, action.payload);
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
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  refreshMovies,
  setActiveTab,
  setCurrentPage,
  setTotalPages,
  updateMovieFilters,
} = movieSlice.actions;
export default movieSlice.reducer;
