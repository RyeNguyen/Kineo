/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, select } from "redux-saga/effects";

import type { NetworkState } from "@/features/network";
import { setNetworkStatus } from "@/features/network";
import { t } from "i18next";

const selectNetworkStatus = (state: { network: NetworkState }) => state.network;

export function* callApiWithNetworkCheck(
  apiFunction: (...args: any[]) => any,
  ...args: any[]
): Generator<any, void, any> {
  const { isConnected } = (yield select(selectNetworkStatus)) as NetworkState;
  if (!isConnected) {
    yield put(setNetworkStatus(false));
    throw new Error(t("error.no_internet"));
  }

  try {
    const response = yield call(apiFunction, ...args);
    return response;
  } catch (error: any) {
    throw new Error(error?.message || t("common_error"));
  }
}
