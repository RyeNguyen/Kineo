import { MovieEndPoint } from "@/config";
import api from "../../../services/axiosConfig";
import type { MovieResponse } from "../models/movie.model";

export const getPopularMoviesApi = async (): Promise<unknown> => {
  try {
    const response = await api.get("/movie/popular?page=1&include_video=true");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

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
    console.log(error);
    // Return a default value or throw to satisfy the return type
    throw new Error("Failed to fetch discovered movies");
  }
};

export const getMovieTrailersApi = async (
  movieId: number
): Promise<unknown> => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
