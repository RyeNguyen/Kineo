import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeScreen } from "@/shared/components/molecules";

const ProfileScreen = () => {
  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 24 },
});

export default ProfileScreen;
