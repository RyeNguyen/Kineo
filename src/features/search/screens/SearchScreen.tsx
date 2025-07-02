import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeScreen } from "@/shared/components/molecules"; // Assuming you have this

const SearchScreen = () => {
  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.text}>Search Screen</Text>
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

export default SearchScreen;
