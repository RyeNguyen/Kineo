import { StateStatus } from "../constant";

export type defaultStoreData<T> = {
  data: T;
  error: string;
  status: StateStatus;
};
