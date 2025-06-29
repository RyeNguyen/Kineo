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

    let endpoint = "";

    switch (activeTab) {
      case TabCategory.POPULAR:
        endpoint = `${type.value}${MovieEndPoint.POPULAR}`;
        break;
      case TabCategory.TOP_RATED:
        endpoint = `${type.value}${MovieEndPoint.TOP_RATED}`;
        break;
      case TabCategory.UPCOMING:
        endpoint = `${type.value}${type.value === VideoType.MOVIE ? MovieEndPoint.UPCOMING : MovieEndPoint.ON_THE_AIR}`;
        break;
      case TabCategory.DISCOVER:
      default:
        endpoint = `${MovieEndPoint.DISCOVER}/${type.value}`;
        break;
    }

    if (score) {
      endpoint += `?vote_average.gte=${score.value}`;
    }

    let pagesToUse = totalPages;

    // --- LOGIC FOR THE VERY FIRST FETCH ---
    if (pagesToUse === 0) {
      const firstResponse = endpoint.includes(MovieEndPoint.DISCOVER)
        ? ((yield callApiWithNetworkCheck(getDiscoveredMoviesApi, {
            endpoint,
            page: 1,
            sort_by: "popularity.desc",
            "vote_count.gte": COMMON_NUMBERS.voteCount,
          })) as MovieResponse)
        : ((yield callApiWithNetworkCheck(getDiscoveredMoviesApi, {
            endpoint,
            page: 1,
          })) as MovieResponse);
      pagesToUse = Math.min(
        firstResponse.total_pages || 0,
        COMMON_NUMBERS.maxBrowsingPages
      );
      yield put(setTotalPages(pagesToUse)); // Set total pages in the state
    }

    let moviesResponse: MovieResponse = {};

    if (endpoint.includes(MovieEndPoint.DISCOVER)) {
      // --- LOGIC TO FIND A NEW, UNIQUE RANDOM PAGE ---
      let randomPage;
      do {
        randomPage = Math.floor(Math.random() * pagesToUse) + 1;
      } while (fetchedPages.includes(randomPage)); // Keep picking until we find a page we haven't fetched

      moviesResponse = (yield callApiWithNetworkCheck(getDiscoveredMoviesApi, {
        endpoint,
        page: randomPage,
        sort_by: "popularity.desc",
        "vote_count.gte": COMMON_NUMBERS.voteCount,
      })) as MovieResponse;
      yield put(setCurrentPage(randomPage));
      // Add the new page to list of fetched pages
      yield put(addFetchedPage(randomPage));
    } else {
      const newPage = currentPage + 1;
      moviesResponse = (yield callApiWithNetworkCheck(getDiscoveredMoviesApi, {
        endpoint,
        page: newPage,
      })) as MovieResponse;
      yield put(setCurrentPage(newPage));
      yield put(addFetchedPage(newPage));
    }

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
