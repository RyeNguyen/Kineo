import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import useTheme from "@/shared/hook/useTheme";
import { TabCategory } from "@/config";

interface FeedTabsProps {
  activeTab: TabCategory;
  onTabPress: (tab: TabCategory) => void;
}

const FeedTabs = ({ activeTab, onTabPress }: FeedTabsProps) => {
  const { fonts } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {Object.values(TabCategory).map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabPress(tab)}
            style={styles.tab}
          >
            <Text
              style={[
                isActive
                  ? fonts.size_MD_BeVietnamProBold
                  : fonts.size_MD_BeVietnamProRegular,
                isActive ? fonts.white : fonts.gray400,
              ]}
            >
              {tab}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: "white",
    borderRadius: 2,
    height: 3,
    marginTop: 6,
    width: "60%",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 12,
  },
});

export default FeedTabs;
