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
  iconNextWhite: "iconNextWhite",
};

export const MASCOT_SIZE = {
  height: 197,
  width: 165,
};

export const COMMON_NUMBERS = {
  maxBrowsingPages: 500,
  maxNameLength: 20,
  maxVideoWidth: 400,
  minNameLength: 3,
  minPasswordLength: 6,
  overviewCharacterLimit: 150,
  voteCount: 200,
  youtubeAspectRatio: 16 / 9,
};

export const VOTE_COUNT = {
  medium: 200,
};
