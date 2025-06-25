import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface NetworkState {
  isConnected: boolean;
}

const initialState: NetworkState = {
  isConnected: true, // Assume online by default
};

const networkSlice = createSlice({
  initialState,
  name: "network",
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setNetworkStatus } = networkSlice.actions;
export default networkSlice.reducer;
