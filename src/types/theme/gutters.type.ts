import type { config } from "@/config/theme/_config";
import type { RemoveAfterSeparator } from "./common.type";
import type { staticGutterStyles } from "@/config/theme/gutters";

type Margins =
  | "margin"
  | "marginBottom"
  | "marginHorizontal"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginVertical";

type MarginKeys = `${Margins}_${keyof typeof config.gutters}`;

type MarginGutters = {
  [key in MarginKeys]: {
    [K in Extract<RemoveAfterSeparator<key>, Margins>]: number;
  };
};

type Paddings =
  | "padding"
  | "paddingBottom"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingVertical";

type PaddingKeys = `${Paddings}_${keyof typeof config.gutters}`;

type PaddingGutters = {
  [key in PaddingKeys]: {
    [K in Extract<RemoveAfterSeparator<key>, Paddings>]: number;
  };
};

type Gaps = `gap_${keyof typeof config.gutters}`;

type GapGutters = {
  [key in Gaps]: {
    gap: number;
  };
};

export type Gutters = GapGutters &
  MarginGutters &
  PaddingGutters &
  typeof staticGutterStyles;
