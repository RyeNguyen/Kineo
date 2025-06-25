import type { PayloadAction } from "@reduxjs/toolkit";

import { put, takeLatest } from "redux-saga/effects";

import { callApiWithNetworkCheck } from "@/shared";

import {
  getPopularMovies,
  getPopularMoviesFailure,
  getPopularMoviesSuccess,
} from "./movieSlice";
import { getPopularMoviesApi } from "../services";

function* getPopularMoviesRequest(
  action: PayloadAction<void>
): Generator<unknown, void, unknown> {
  try {
    const response = yield callApiWithNetworkCheck(getPopularMoviesApi);

    yield put(getPopularMoviesSuccess(response)); // Dispatch success action
  } catch (error: any) {
    yield put(getPopularMoviesFailure(error.message)); // Dispatch failure action
  }
}
export function* authSaga() {
  yield takeLatest(getPopularMovies.type, getPopularMoviesRequest);
}
