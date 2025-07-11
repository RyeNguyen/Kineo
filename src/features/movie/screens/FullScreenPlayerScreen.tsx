// src/screens/FullScreenPlayerScreen/index.tsx

import React, { useCallback, useEffect } from "react";
import {
  BackHandler,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
// eslint-disable-next-line import/no-extraneous-dependencies
import Orientation from "react-native-orientation-locker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DEVICE_SIZE } from "@/shared/constant";

const FullScreenPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoId } = route.params as { videoId: string };

  useEffect(() => {
    // 1. When the screen mounts, lock to landscape and hide the status bar
    Orientation.lockToLandscape();
    StatusBar.setHidden(true);

    // 2. When the screen unmounts, unlock orientation and show status bar
    return () => {
      Orientation.lockToPortrait();
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
    };
  }, []);

  // Handle Android back button press to exit full screen
  const handleClose = useCallback(() => {
    navigation.goBack();
    return true; // Prevents the app from closing
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleClose
    );
    return () => backHandler.remove();
  }, [handleClose]);

  return (
    <View style={styles.container}>
      <YoutubeIframe
        // NOTE: For landscape, device width becomes height and vice versa
        height={DEVICE_SIZE.width}
        initialPlayerParams={{ controls: true }} // Show native controls in full screen
        play={true} // Autoplay in full screen
        videoId={videoId}
        width={DEVICE_SIZE.height} // Width becomes height in landscape
      />

      {/* Optional: Add a custom close button for iOS */}
      {/* <Pressable onPress={handleClose} style={styles.closeButton}>
        <Icon color="#fff" name="close" size={30} />
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    left: 20,
    padding: 5,
    position: "absolute",
    top: 20,
    zIndex: 10,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
});

export default FullScreenPlayerScreen;
