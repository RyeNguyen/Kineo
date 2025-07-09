export const UserEndPoint = {
  GET_USER: `https://jsonplaceholder.typicode.com/users`,
};

export const AuthEndPoint = {
  GET_USER: `/auth/me`,
  LOGIN: `/auth/login`,
  LOGOUT: `/auth/logout`,
  REFRESH: `/auth/refresh`,
  REGISTER: `/auth/register`,
};

export const MovieEndPoint = {
  DISCOVER: `/discover`,
  GENRE: `/genre/{movieType}/list`,
  MOVIE_DETAIL: `/movie/{movieId}`,
  ON_THE_AIR: `/on_the_air`,
  POPULAR: `/popular`,
  TOP_RATED: `/top_rated`,
  UPCOMING: `/upcoming`,
};

export const ConfigurationEndpoint = {
  COUNTRIES: `/configuration/countries`,
  LANGUAGES: `/configuration/languages`,
};

export const YouTubeEndPoint = {
  IMAGE: `https://img.youtube.com/vi/{videoKey}/{videoQuality}.jpg`,
};
