import "react-native-gesture-handler";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";

import ApplicationNavigator from "@/navigation/Application";

import "@/translations";

import type { AuthState } from "./features/auth/store/authSlice";

import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ErrorModal, NetworkBanner } from "./shared/components/atoms";
import ThemeProvider from "./config/theme/ThemeProvider/ThemeProvider";
import { logoutRequest } from "./features/auth/store/authSlice";
import { setNetworkStatus } from "./features/network/store/networkSlice";
import { persistor, store } from "./redux/store";

export const storage = new MMKV();

const NetworkListener = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        dispatch(setNetworkStatus(true));
      } else {
        dispatch(setNetworkStatus(false));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

const MainApp = () => {
  const dispatch = useDispatch();
  const expiredToken = useSelector(
    (state: { auth: AuthState }) => state.auth.expiredToken
  );
  const onCloseErrorModal = () => {
    dispatch(logoutRequest());
  };
  return (
    <GestureHandlerRootView>
      <ThemeProvider storage={storage}>
        <NetworkListener />
        <NetworkBanner />
        <ApplicationNavigator />
        <ErrorModal
          errorMessage="Token expired"
          onClose={onCloseErrorModal}
          visible={!!expiredToken}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
