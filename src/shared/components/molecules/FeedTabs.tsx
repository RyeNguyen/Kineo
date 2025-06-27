import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import useTheme from "@/shared/hook/useTheme";
import { TabCategory } from "@/config";
import { verticalScale } from "@/shared/utils";

interface FeedTabsProps {
  activeTab: TabCategory;
  onTabPress: (tab: TabCategory) => void;
}

const FeedTabs = ({ activeTab, onTabPress }: FeedTabsProps) => {
  const { backgrounds, borders, fonts, gutters, layout } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        layout.row,
        layout.itemsStart,
        gutters.gap_MEDIUM,
      ]}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {Object.values(TabCategory).map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabPress(tab)}
            style={[layout.itemsEnd, gutters.gap_XSMALL]}
          >
            <Text
              style={[
                isActive
                  ? fonts.size_SM_BeVietnamProBold
                  : fonts.size_SM_BeVietnamProRegular,
                isActive ? fonts.white : fonts.gray400,
              ]}
            >
              {tab}
            </Text>
            {isActive && (
              <View
                style={[
                  backgrounds.white,
                  borders.rounded_16,
                  styles.activeIndicator,
                ]}
              />
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activeIndicator: {
    height: verticalScale(4),
    width: "40%",
  },
});

export default FeedTabs;
