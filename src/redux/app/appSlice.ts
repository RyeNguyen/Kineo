/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

interface AppState {}

export const initialState: AppState = {};

const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {},
});

export const {} = appSlice.actions;
export default appSlice.reducer;
