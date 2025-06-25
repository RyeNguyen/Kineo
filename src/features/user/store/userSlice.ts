import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

import { StateStatus } from "@/config";
import { defaultStoreData } from "@/shared";
import { User } from "../models/user.model";

export interface UserState {
  userInfo: defaultStoreData<User>;
}

const initialState: UserState = {
  userInfo: {
    data: {},
    error: "",
    status: StateStatus.INIT,
  },
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    updateUserData: (state, action: PayloadAction<any>) => {
      Object.assign(state.userInfo.data, action.payload);
    },
  },
});

export const { updateUserData } = userSlice.actions;
export default userSlice.reducer;
