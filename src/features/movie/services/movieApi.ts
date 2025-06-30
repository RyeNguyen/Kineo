import { ConfigurationEndpoint, MovieEndPoint } from "@/config";
import api from "../../../services/axiosConfig";
import type { MovieResponse } from "../models/movie.model";
import { interpolateString } from "@/shared/utils/stringHelper";

export const getDiscoveredMoviesApi = async ({
  endpoint,
  ...params
}: {
  endpoint: string;
}): Promise<MovieResponse> => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    // Return a default value or throw to satisfy the return type
    throw new Error("Failed to fetch discovered movies");
  }
};

export const getMovieTrailersApi = async (
  endpoint: string
): Promise<unknown> => {
  try {
    const response = await api.get(`${endpoint}/videos`);

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getCountriesApi = async (): Promise<unknown> => {
  try {
    const response = await api.get(ConfigurationEndpoint.COUNTRIES);

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getGenresApi = async (movieType: string): Promise<unknown> => {
  try {
    const response = await api.get(
      interpolateString(MovieEndPoint.GENRE, { movieType })
    );

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
