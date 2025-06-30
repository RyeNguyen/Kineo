import type {
  Country,
  Movie,
  MovieGenreResponse,
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
  getCountries,
  getCountriesFailure,
  getCountriesSuccess,
  getDiscoveredMovies,
  getDiscoveredMoviesFailure,
  getDiscoveredMoviesSuccess,
  getGenres,
  getGenresFailure,
  getGenresSuccess,
  refreshMovies,
  setCurrentPage,
  setTotalPages,
} from "./movieSlice";
import {
  getCountriesApi,
  getDiscoveredMoviesApi,
  getGenresApi,
  getMovieTrailersApi,
} from "../services";
import {
  ADVANCED_FILTER,
  MovieEndPoint,
  TabCategory,
  VideoType,
} from "@/shared/constant";
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
    const { genres, score, type, voteCount, year } = filter;

    const endpoint = `${MovieEndPoint.DISCOVER}/${type.value}`;
    const params: Record<string, unknown> = {};

    switch (activeTab) {
      case TabCategory.TOP_RATED:
        params[ADVANCED_FILTER.criteria.sortBy] =
          `${ADVANCED_FILTER.criteria.voteAverage}.${ADVANCED_FILTER.order.desc}`;
        params[
          `${ADVANCED_FILTER.criteria.voteCount}.${ADVANCED_FILTER.comparison.gte}`
        ] = COMMON_NUMBERS.voteCount;
        break;
      case TabCategory.UPCOMING:
        params[
          type.value === VideoType.MOVIE
            ? `${ADVANCED_FILTER.criteria.primaryReleaseDate}.${ADVANCED_FILTER.comparison.gte}`
            : `${ADVANCED_FILTER.criteria.firstAirDate}.${ADVANCED_FILTER.comparison.gte}`
        ] = new Date().toISOString().split("T")[0];
        params[ADVANCED_FILTER.criteria.sortBy] =
          type.value === VideoType.MOVIE
            ? `${ADVANCED_FILTER.criteria.primaryReleaseDate}.${ADVANCED_FILTER.order.asc},${ADVANCED_FILTER.criteria.popularity}.${ADVANCED_FILTER.order.desc}`
            : `${ADVANCED_FILTER.criteria.firstAirDate}.${ADVANCED_FILTER.order.asc},${ADVANCED_FILTER.criteria.popularity}.${ADVANCED_FILTER.order.desc}`;
        break;
      case TabCategory.POPULAR:
      case TabCategory.DISCOVER:
      default:
        params[ADVANCED_FILTER.criteria.sortBy] =
          `${ADVANCED_FILTER.criteria.popularity}.${ADVANCED_FILTER.order.desc}`;
        params[
          `${ADVANCED_FILTER.criteria.voteCount}.${ADVANCED_FILTER.comparison.gte}`
        ] = COMMON_NUMBERS.voteCount;
        break;
    }

    if (score) {
      params[
        `${ADVANCED_FILTER.criteria.voteAverage}.${ADVANCED_FILTER.comparison.gte}`
      ] = score.value;
    }

    if (voteCount) {
      params[
        `${ADVANCED_FILTER.criteria.voteCount}.${ADVANCED_FILTER.comparison.gte}`
      ] = voteCount.value;
    }

    if (genres.length > 0) {
      params[`${ADVANCED_FILTER.criteria.withGenres}`] = "";

      for (let i = 0; i < genres.length; i++) {
        params[`${ADVANCED_FILTER.criteria.withGenres}`] += genres[i];
        if (i + 1 < genres.length) {
          params[`${ADVANCED_FILTER.criteria.withGenres}`] += "|";
        }
      }
    }

    if (year) {
      params[
        type.value === VideoType.MOVIE
          ? `${ADVANCED_FILTER.criteria.primaryReleaseYear}`
          : `${ADVANCED_FILTER.criteria.firstAirDateYear}`
      ] = year;
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

function* getCountriesRequest(): Generator<unknown, void, unknown> {
  try {
    const response: Country[] = (yield callApiWithNetworkCheck(
      getCountriesApi
    )) as Country[];

    yield put(getCountriesSuccess(response));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : t("common:error.unknown_error");
    yield put(getCountriesFailure(errorMessage)); // Dispatch failure action
  }
}

function* getGenresRequest(): Generator<unknown, void, unknown> {
  try {
    const { filter } = (yield select(getMovieState)) as MovieState;
    const { type } = filter;

    const response: MovieGenreResponse = (yield callApiWithNetworkCheck(
      getGenresApi,
      type.value
    )) as MovieGenreResponse;

    yield put(getGenresSuccess(response.genres || []));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : t("common:error.unknown_error");
    yield put(getGenresFailure(errorMessage)); // Dispatch failure action
  }
}

export function* movieSaga() {
  yield takeLatest(getDiscoveredMovies.type, getDiscoveredMoviesRequest);
  yield takeLatest(refreshMovies.type, refreshFeedRequest);
  yield takeLatest(getCountries.type, getCountriesRequest);
  yield takeLatest(getGenres.type, getGenresRequest);
}
