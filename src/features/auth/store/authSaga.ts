import type { PayloadAction } from "@reduxjs/toolkit";
import type { Auth } from "@/models";

import { put, select, takeLatest } from "redux-saga/effects";

import { MMKVStorage } from "@/config";
import { loginApi, logoutApi, registerApi } from "@/features/auth/services";

import { callApiWithNetworkCheck } from "@/shared";

import {
  AuthState,
  loginRequest,
  loginRequestFailure,
  loginRequestSuccess,
  logoutRequest,
  logoutRequestFailure,
  logoutRequestSuccess,
} from "./authSlice";

function* loginAction(
  action: PayloadAction<Record<string, any>>
): Generator<any, void, any> {
  try {
    const { isLogin, data } = action.payload;
    const user: { user: Auth; tokens: any } = yield callApiWithNetworkCheck(
      isLogin ? loginApi : registerApi,
      data
    ); // Call API
    if (user.tokens.accessToken) {
      MMKVStorage.saveValue(MMKVStorage.KEYS.TOKEN, user.tokens.accessToken);
    }
    if (user.tokens.refreshToken) {
      MMKVStorage.saveValue(
        MMKVStorage.KEYS.REFRESH_TOKEN,
        user.tokens.refreshToken
      );
    }
    yield put(loginRequestSuccess(user.user)); // Dispatch success action
  } catch (error: any) {
    yield put(loginRequestFailure(error.message)); // Dispatch failure action
  }
}

function* logoutAction(action: PayloadAction<void>): Generator<any, void, any> {
  try {
    const userId = yield select(
      (state: { auth: AuthState }) => state.auth.authInfor?.id
    );
    const refreshToken = MMKVStorage.getValue(MMKVStorage.KEYS.REFRESH_TOKEN);
    const response = yield callApiWithNetworkCheck(logoutApi, {
      userId,
      refreshToken,
    }); // Call API

    MMKVStorage.saveValue(MMKVStorage.KEYS.TOKEN, "");
    MMKVStorage.saveValue(MMKVStorage.KEYS.REFRESH_TOKEN, "");

    yield put(logoutRequestSuccess(response)); // Dispatch success action
  } catch (error: any) {
    yield put(logoutRequestFailure(error.message)); // Dispatch failure action
  }
}
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginAction);
  yield takeLatest(logoutRequest.type, logoutAction);
}
