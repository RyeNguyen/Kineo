import type {
  Movie,
  MovieResponse,
  MovieVideoResponse,
} from "./../models/movie.model";
import type { PayloadAction } from "@reduxjs/toolkit";
import { t } from "i18next";

import { all, put, select, takeLatest } from "redux-saga/effects";

import { callApiWithNetworkCheck } from "@/shared";

import type { MovieState, MovieWithMetadata } from "./movieSlice";
import {
  addFetchedPage,
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getPopularMovies,
  setTotalPages,
} from "./movieSlice";
import { getDiscoveredMoviesApi, getMovieTrailersApi } from "../services";
import { COMMON_NUMBERS } from "@/shared/constant";

const getMovieState = (state: { movie: MovieState }) => state.movie;

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
  // try {
  //   const response = yield callApiWithNetworkCheck(getPopularMoviesApi);
  //   yield put(getPopularMoviesSuccess(response)); // Dispatch success action
  // } catch (error: unknown) {
  //   const errorMessage =
  //     error instanceof Error ? error.message : t("common:error.unknown_error");
  //   yield put(getPopularMoviesFailure(errorMessage)); // Dispatch failure action
  // }
}

function* getDiscoveredMoviesRequest(
  action: PayloadAction<void>
): Generator<unknown, void, unknown> {
  try {
    // Get the current state from the store
    const { fetchedPages, totalPages } = (yield select(
      getMovieState
    )) as MovieState;

    let pagesToUse = totalPages;

    // --- LOGIC FOR THE VERY FIRST FETCH ---
    if (pagesToUse === 0) {
      const discoverResponse = (yield callApiWithNetworkCheck(
        getDiscoveredMoviesApi,
        {
          page: 1,
          sort_by: "popularity.desc",
          "vote_count.gte": COMMON_NUMBERS.voteCount,
        }
      )) as MovieResponse;
      pagesToUse = Math.min(discoverResponse.total_pages || 0, 500);
      yield put(setTotalPages(pagesToUse)); // Set total pages in the state
    }

    // --- LOGIC TO FIND A NEW, UNIQUE RANDOM PAGE ---
    let randomPage;
    do {
      randomPage = Math.floor(Math.random() * pagesToUse) + 1;
    } while (fetchedPages.includes(randomPage)); // Keep picking until we find a page we haven't fetched

    const moviesResponse = (yield callApiWithNetworkCheck(
      getDiscoveredMoviesApi,
      {
        page: randomPage,
        sort_by: "popularity.desc",
        "vote_count.gte": COMMON_NUMBERS.voteCount,
      }
    )) as MovieResponse;

    // Add the new page to list of fetched pages
    yield put(addFetchedPage(randomPage));

    const movies: Movie[] = moviesResponse.results || [];

    const moviesWithTrailers = (yield all(
      movies.map((movie) =>
        callApiWithNetworkCheck(getMovieTrailerRequest, movie)
      )
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
