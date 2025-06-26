import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus } from "@/config";
import type { Movie } from "../models/movie.model";
import type { defaultStoreData } from "@/shared";

export interface MovieWithMetadata extends Movie {
  trailerKey?: string;
}

export interface MovieState {
  discoveries: defaultStoreData<MovieWithMetadata[]>;
  error: string;
  popular: defaultStoreData<MovieWithMetadata[]>;
  status: StateStatus;
}

const initialState: MovieState = {
  discoveries: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  error: "",
  popular: {
    data: [],
    error: "",
    status: StateStatus.INIT,
  },
  status: StateStatus.INIT,
};

const movieSlice = createSlice({
  initialState,
  name: "movie",
  reducers: {
    getDiscoveredMovies: (state) => {
      Object.assign(state.discoveries, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getDiscoveredMoviesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state.discoveries, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getDiscoveredMoviesSuccess: (
      state,
      action: PayloadAction<MovieWithMetadata[]>
    ) => {
      Object.assign(state.discoveries, {
        data: action.payload,
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
  },
});

export const {
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getPopularMovies,
  getPopularMoviesFailure,
  getPopularMoviesSuccess,
} = movieSlice.actions;
export default movieSlice.reducer;
