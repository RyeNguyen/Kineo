import { Dimensions } from "react-native";

export const DEVICE_SIZE = {
  guidelineBaseHeight: 874,
  guidelineBaseWidth: 402,
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
};

export const ICONS = {
  iconBack: "iconBack",
  iconEye: "iconEye",
  iconEyeHidden: "iconEyeHidden",
  iconFilter: "iconFilter",
  iconMovie: "iconMovie",
  iconNextWhite: "iconNextWhite",
  iconPlay: "iconPlay",
  iconProfile: "iconProfile",
  iconSearch: "iconSearch",
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
  voteCount: 500,
  youtubeAspectRatio: 16 / 9,
};

export const VOTE_COUNT = {
  medium: 200,
};
