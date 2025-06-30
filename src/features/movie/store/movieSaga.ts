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
  clearMovieState,
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  refreshMovies,
  setCurrentPage,
  setTotalPages,
} from "./movieSlice";
import { getDiscoveredMoviesApi, getMovieTrailersApi } from "../services";
import { MovieEndPoint, TabCategory, VideoType } from "@/shared/constant";
import { COMMON_NUMBERS } from "@/shared/constant";

const getMovieState = (state: { movie: MovieState }) => state.movie;

function* getMovieTrailerRequest(
  movie: Movie
): Generator<unknown, Movie, MovieWithMetadata> {
  try {
    const { filter } = (yield select(getMovieState)) as unknown as MovieState;
    const { type } = filter;

    const endpoint = `/${type.value}/${movie.id}`;

    const videosResponse = (yield callApiWithNetworkCheck(
      getMovieTrailersApi,
      endpoint
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

function* getDiscoveredMoviesRequest(
  action: PayloadAction<unknown>
): Generator<unknown, void, unknown> {
  try {
    // Get the current state from the store
    const { activeTab, filter, pagination } = (yield select(
      getMovieState
    )) as MovieState;
    const { currentPage, fetchedPages, totalPages } = pagination[activeTab];
    const { score, type } = filter;

    const endpoint = `${MovieEndPoint.DISCOVER}/${type.value}`;
    const params: Record<string, unknown> = {};

    switch (activeTab) {
      case TabCategory.TOP_RATED:
        params["sort_by"] = "vote_average.desc";
        params["vote_count.gte"] = COMMON_NUMBERS.voteCount;
        break;
      case TabCategory.UPCOMING:
        params[
          type.value === VideoType.MOVIE
            ? "primary_release_date.gte"
            : "first_air_date.gte"
        ] = "2025-03-30";
        params["sort_by"] =
          type.value === VideoType.MOVIE
            ? "primary_release_date.asc"
            : "first_air_date.asc";
        params["vote_count.gte"] = 200;
        break;
      case TabCategory.POPULAR:
      case TabCategory.DISCOVER:
      default:
        params["sort_by"] = "popularity.desc";
        params["vote_count.gte"] = COMMON_NUMBERS.voteCount;
        break;
    }

    if (score) {
      params["vote_average.gte"] = score.value;
    }

    let pagesToUse = totalPages;

    // --- LOGIC FOR THE VERY FIRST FETCH ---
    if (pagesToUse === 0) {
      const firstResponse = (yield callApiWithNetworkCheck(
        getDiscoveredMoviesApi,
        {
          endpoint,
          page: 1,
          ...params,
        }
      )) as MovieResponse;
      pagesToUse = Math.min(
        firstResponse.total_pages || 0,
        COMMON_NUMBERS.maxBrowsingPages
      );
      yield put(setTotalPages(pagesToUse)); // Set total pages in the state
    }

    let moviesResponse: MovieResponse = {};
    let newPage: number = 0;

    if (activeTab === TabCategory.DISCOVER) {
      // --- LOGIC TO FIND A NEW, UNIQUE RANDOM PAGE ---
      do {
        newPage = Math.floor(Math.random() * pagesToUse) + 1;
      } while (fetchedPages.includes(newPage)); // Keep picking until we find a page we haven't fetched
    } else {
      newPage = currentPage + 1;
    }

    moviesResponse = (yield callApiWithNetworkCheck(getDiscoveredMoviesApi, {
      endpoint,
      page: newPage,
      ...params,
    })) as MovieResponse;
    yield put(setCurrentPage(newPage));
    yield put(addFetchedPage(newPage));

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

function* refreshFeedRequest(): Generator<unknown, void, unknown> {
  try {
    // First, dispatch the action to clear the current state
    yield put(clearMovieState());
    // Then, call the existing saga to fetch a new batch of movies
    yield callApiWithNetworkCheck(getDiscoveredMoviesRequest, {
      payload: undefined,
      type: getDiscoveredMovies.type,
    });
  } catch (error) {
    // Handle any errors during refresh if necessary
    // eslint-disable-next-line no-console
    console.error("Refresh failed", error);
  }
}

export function* movieSaga() {
  yield takeLatest(getDiscoveredMovies.type, getDiscoveredMoviesRequest);
  yield takeLatest(refreshMovies.type, refreshFeedRequest);
}
