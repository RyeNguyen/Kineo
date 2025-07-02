import type {
  MovieDetail,
  MovieVideo,
  MovieVideoResponse,
} from "./../models/movie.model";
import type { PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";

import { put, takeLatest } from "redux-saga/effects";

import { callApiWithNetworkCheck } from "@/shared";

import type { MovieState } from "./movieSlice";
import {
  getMovieDetail,
  getMovieDetailFailed,
  getMovieDetailSuccess,
} from "./movieDetailSlice";
import { getMovieDetailApi, getMovieTrailersApi } from "../services";

const getMovieState = (state: { movie: MovieState }) => state.movie;

function* getMovieTrailersRequest(
  movieId: number
): Generator<unknown, MovieVideo[], unknown> {
  try {
    // const { filter } = (yield select(getMovieState)) as unknown as MovieState;
    // const { type } = filter;

    const endpoint = `/movie/${movieId}`;

    const videosResponse = (yield callApiWithNetworkCheck(
      getMovieTrailersApi,
      endpoint
    )) as MovieVideoResponse;

    const trailers: MovieVideo[] = (videosResponse.results || []).filter(
      (video) => video.site === "YouTube"
    );

    return trailers;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Could not fetch trailers:`, error);
    return [];
  }
}

function* getMovieDetailRequest(
  action: PayloadAction<{ movieId: number }>
): Generator<unknown, void, unknown> {
  try {
    const response: MovieDetail = (yield callApiWithNetworkCheck(
      getMovieDetailApi,
      action.payload.movieId
    )) as MovieDetail;

    const videos: MovieVideo[] = (yield callApiWithNetworkCheck(
      getMovieTrailersRequest,
      response.id
    )) as MovieVideo[];

    yield put(getMovieDetailSuccess({ videos, ...response }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : t("common:error.unknown_error");
    yield put(getMovieDetailFailed(errorMessage));
  }
}

export function* movieDetailSaga() {
  yield takeLatest(getMovieDetail.type, getMovieDetailRequest);
}
