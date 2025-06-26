import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus } from "@/config";
import type { Movie } from "../models/movie.model";
import type { defaultStoreData } from "@/shared";

export interface MovieWithMetadata extends Movie {
  trailerKey?: string;
}

export interface MovieState {
  currentPage: number;
  error: string;
  fetchedPages: number[];
  movies: defaultStoreData<MovieWithMetadata[]>;
  popular: defaultStoreData<MovieWithMetadata[]>;
  status: StateStatus;
  totalPages: number;
}

const initialState: MovieState = {
  currentPage: 0,
  error: "",
  fetchedPages: [],
  movies: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  popular: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  status: StateStatus.INIT,
  totalPages: 0,
};

const movieSlice = createSlice({
  initialState,
  name: "movie",
  reducers: {
    addFetchedPage: (state, action: PayloadAction<number>) => {
      if (!state.fetchedPages.includes(action.payload)) {
        state.fetchedPages.push(action.payload);
      }
    },
    getDiscoveredMovies: (state) => {
      Object.assign(state.movies, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getDiscoveredMoviesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.movies, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getDiscoveredMoviesSuccess: (
      state,
      action: PayloadAction<MovieWithMetadata[]>
    ) => {
      Object.assign(state.movies, {
        data: [...state.movies.data, ...action.payload],
        error: "",
        status: StateStatus.SUCCESS,
      });
    },
    getPopularMovies: (state) => {
      Object.assign(state.popular, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getPopularMoviesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.popular, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getPopularMoviesSuccess: (
      state,
      action: PayloadAction<MovieWithMetadata[]>
    ) => {
      Object.assign(state.popular, {
        data: action.payload,
        error: "",
        status: StateStatus.SUCCESS,
      });
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  },
});

export const {
  addFetchedPage,
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getPopularMovies,
  getPopularMoviesFailure,
  getPopularMoviesSuccess,
  setTotalPages,
} = movieSlice.actions;
export default movieSlice.reducer;
