import api from "../../../services/axiosConfig";

export const getPopularMoviesApi = async (): Promise<unknown> => {
  try {
    const response = await api.get("/movie/popular?page=1&include_video=true");
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
