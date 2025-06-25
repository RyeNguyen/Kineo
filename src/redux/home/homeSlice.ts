import type { PayloadAction } from '@reduxjs/toolkit';
import type { Auth, User } from '@/models';

import { createSlice } from '@reduxjs/toolkit';

import { StateStatus } from '@/config';

export interface HomeState {
  error: string;
  status: StateStatus;
  user: null | User;
}

const initialState: HomeState = {
  error: '',
  status: StateStatus.INIT,
  user: null
};

const homeSlice = createSlice({
  initialState,
  name: 'home',
  reducers: {
    fetchUser: (state) => {
      Object.assign(state, {
        error: '',
        status: StateStatus.LOADING
      });
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      Object.assign(state, {
        error: action.payload,
        status: StateStatus.ERROR
      });
    },
    fetchUserSuccess: (state, action: PayloadAction<Auth>) => {
      Object.assign(state, {
        error: '',
        status: StateStatus.SUCCESS,
        user: action.payload,
      });
    },
    resetError: (state, action: PayloadAction<void>) => {
      Object.assign(state, {
        error: '',
        status: state.status,
        user: state.user
      });
    }, 
  },
});

export const {
  fetchUser,
  fetchUserFailure,
  fetchUserSuccess,
  resetError
} = homeSlice.actions;
export default homeSlice.reducer;
