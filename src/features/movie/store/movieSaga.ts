import type {
  Movie,
  MovieResponse,
  MovieVideoResponse,
} from "./../models/movie.model";
import type { PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";

import { all, call, put, takeLatest } from "redux-saga/effects";

import { callApiWithNetworkCheck } from "@/shared";

import type { MovieWithMetadata } from "./movieSlice";
import {
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getPopularMovies,
  getPopularMoviesFailure,
  getPopularMoviesSuccess,
} from "./movieSlice";
import {
  getDiscoveredMoviesApi,
  getMovieTrailersApi,
  getPopularMoviesApi,
} from "../services";
import { VOTE_COUNT } from "@/shared/constant";

function* getMovieTrailerRequest(
  movie: Movie
): Generator<unknown, Movie, MovieWithMetadata> {
  try {
    const videosResponse = (yield callApiWithNetworkCheck(
      getMovieTrailersApi,
      movie.id
    )) as MovieVideoResponse;

    const trailer = (videosResponse.results || []).find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );

    if (trailer) {
      return { ...movie, trailerKey: trailer.key } as MovieWithMetadata;
    }

    return movie;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Could not fetch trailer for "${movie.title}":`, error);
    return movie;
  }
}

function* getPopularMoviesRequest(
  action: PayloadAction<void>
): Generator<unknown, void, unknown> {
  try {
    const response = yield callApiWithNetworkCheck(getPopularMoviesApi);

    yield put(getPopularMoviesSuccess(response)); // Dispatch success action
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : t("common:error.unknown_error");
    yield put(getPopularMoviesFailure(errorMessage)); // Dispatch failure action
  }
}

function* getDiscoveredMoviesRequest(
  action: PayloadAction<void>
): Generator<unknown, void, unknown> {
  try {
    const discoverResponse = (yield callApiWithNetworkCheck(
      getDiscoveredMoviesApi,
      {
        page: 1,
        sort_by: "popularity.desc",
        "vote_count.gte": VOTE_COUNT.medium,
      }
    )) as MovieResponse;

    const totalPages = Math.min(discoverResponse.total_pages || 0, 500);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const moviesResponse = (yield callApiWithNetworkCheck(
      getDiscoveredMoviesApi,
      {
        page: randomPage,
        sort_by: "popularity.desc",
        "vote_count.gte": VOTE_COUNT.medium,
      }
    )) as MovieResponse;

    const movies: Movie[] = moviesResponse.results || [];

    const moviesWithTrailers = (yield all(
      movies.map((movie) => call(getMovieTrailerRequest, movie))
    )) as MovieWithMetadata[];

    yield put(getDiscoveredMoviesSuccess(moviesWithTrailers)); // Dispatch success action
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : t("common:error.unknown_error");
    yield put(getDiscoveredMoviesFailure(errorMessage)); // Dispatch failure action
  }
}

export function* movieSaga() {
  yield takeLatest(getPopularMovies.type, getPopularMoviesRequest);
  yield takeLatest(getDiscoveredMovies.type, getDiscoveredMoviesRequest);
}
