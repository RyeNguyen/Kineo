/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/user/userSaga.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/models';

import { put, takeLatest } from 'redux-saga/effects';

import { getUser } from '@/data';

import { callApiWithNetworkCheck } from '@/utils';

import {
  fetchUser,
  fetchUserFailure,
  fetchUserSuccess,
} from './homeSlice';

function* handleGetUser(action: PayloadAction<undefined>): Generator<any, void, any> {
  try {
    const user: User = yield callApiWithNetworkCheck(getUser, action.payload); // Call API
    yield put(fetchUserSuccess(user)); // Dispatch success action
  } catch (error: any) {
    yield put(fetchUserFailure(error.message)); // Dispatch failure action
  }
}

export function* homeSaga() {
  yield takeLatest(fetchUser.type, handleGetUser);
}
