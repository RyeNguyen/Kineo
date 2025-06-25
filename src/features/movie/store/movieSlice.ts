import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { StateStatus } from "@/config";

export interface MovieState {
  error: string;
  popular: [];
  status: StateStatus;
}

const initialState: MovieState = {
  error: "",
  popular: [],
  status: StateStatus.INIT,
};

const movieSlice = createSlice({
  initialState,
  name: "movie",
  reducers: {
    getPopularMovies: (state) => {
      Object.assign(state, {
        error: "",
        status: StateStatus.LOADING,
      });
    },
    getPopularMoviesFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state, {
        error: action.payload,
        status: StateStatus.ERROR,
      });
    },
    getPopularMoviesSuccess: (state, action: PayloadAction<any>) => {
      Object.assign(state, {
        error: "",
        popular: action.payload,
        status: StateStatus.SUCCESS,
      });
    },
  },
});

export const {
  getPopularMovies,
  getPopularMoviesFailure,
  getPopularMoviesSuccess,
} = movieSlice.actions;
export default movieSlice.reducer;
