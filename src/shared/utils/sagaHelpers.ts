/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, select } from "redux-saga/effects";

import { setNetworkStatus } from "@/features/network";
import { t } from "i18next";

const selectNetworkStatus = (state: any) => state.network.isConnected;
export function* callApiWithNetworkCheck(
  apiFunction: (...args: any[]) => any,
  ...args: any[]
): Generator<any, void, any> {
  const isConnected = yield select(selectNetworkStatus);
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
