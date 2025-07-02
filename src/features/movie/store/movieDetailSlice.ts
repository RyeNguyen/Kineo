import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus } from "@/config";
import type { MovieDetail, MovieVideo } from "../models/movie.model";
import type { defaultStoreData } from "@/shared";

export interface MovieDetailWithMetadata extends MovieDetail {
  videos: MovieVideo[];
}

export interface MovieDetailState {
  browsingHistory: {
    [key: string]: MovieDetailWithMetadata;
  };
  currentMovie: defaultStoreData<MovieDetailWithMetadata | null>;
}

const initialState: MovieDetailState = {
  browsingHistory: {},
  currentMovie: {
    data: null,
    error: "",
    status: StateStatus.INIT,
  },
};

const movieDetailSlice = createSlice({
  initialState,
  name: "movieDetail",
  reducers: {
    getMovieDetail: (state, action: PayloadAction<{ movieId: number }>) => {
      Object.assign(state.currentMovie, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getMovieDetailFailed: (state, action: PayloadAction<string>) => {
      Object.assign(state.currentMovie, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getMovieDetailSuccess: (
      state,
      action: PayloadAction<MovieDetailWithMetadata>
    ) => {
      Object.assign(state.currentMovie, {
        data: action.payload,
        status: StateStatus.SUCCESS,
      });
      Object.assign(state.browsingHistory, {
        [action.payload.id as number]: action.payload,
      });
    },
  },
});

export const { getMovieDetail, getMovieDetailFailed, getMovieDetailSuccess } =
  movieDetailSlice.actions;
export default movieDetailSlice.reducer;
