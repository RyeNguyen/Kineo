import { Dimensions } from "react-native";

export const DEVICE_SIZE = {
  guidelineBaseHeight: 874,
  guidelineBaseWidth: 402,
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
};

export const ICONS = {
  iconBack: "iconBack",
  iconBackward: "iconBackward",
  iconEye: "iconEye",
  iconEyeHidden: "iconEyeHidden",
  iconFilter: "iconFilter",
  iconForward: "iconForward",
  iconMovie: "iconMovie",
  iconMovieActive: "iconMovieActive",
  iconNextWhite: "iconNextWhite",
  iconPause: "iconPause",
  iconPlay: "iconPlay",
  iconProfile: "iconProfile",
  iconProfileActive: "iconProfileActive",
  iconSearch: "iconSearch",
  iconSearchActive: "iconSearchActive",
  iconStarActive: "iconStarActive",
};

export const MASCOT_SIZE = {
  height: 197,
  width: 165,
};

export const COMMON_NUMBERS = {
  afterSeekTimeout: 500,
  maxBrowsingPages: 500,
  maxNameLength: 20,
  maxVideoWidth: 400,
  minNameLength: 3,
  minPasswordLength: 6,
  overviewCharacterLimit: 150,
  pollingTime: 500,
  seekingTime: 5,
  startFromYear: 1999,
  tabBarHeight: 74,
  voteCount: 500,
  youtubeAspectRatio: 16 / 9,
};

export const COMMON_COUNTRIES = [
  "Canada",
  "France",
  "Germany",
  "Italy",
  "India",
  "Japan",
  "Spain",
  "United States",
  "United Kingdom",
];

export const ADVANCED_FILTER = {
  comparison: {
    gte: "gte",
    lte: "lte",
  },
  criteria: {
    firstAirDate: "first_air_date",
    firstAirDateYear: "first_air_date_year",
    popularity: "popularity",
    primaryReleaseDate: "primary_release_date",
    primaryReleaseYear: "primary_release_year",
    sortBy: "sort_by",
    voteAverage: "vote_average",
    voteCount: "vote_count",
    withGenres: "with_genres",
    withOriginCountry: "with_origin_country",
  },
  order: {
    asc: "asc",
    desc: "desc",
  },
};
