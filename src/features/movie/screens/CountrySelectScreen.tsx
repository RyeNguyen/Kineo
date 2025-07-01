import type { Paths } from "@/navigation/paths";
import { SafeScreen } from "@/shared/components/molecules";
import { useTheme } from "@/shared/hook";
import type { RootScreenProps } from "@/types";
import { FlatList, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { type MovieState, updateCountryFilter } from "../store/movieSlice";
import type { Country } from "../models/movie.model";
import { useMemo, useState } from "react";
import { Button, Input } from "@/shared/components/atoms";
import { t } from "i18next";

const CountrySelectScreen = ({
  navigation,
}: RootScreenProps<Paths.SelectCountry>) => {
  const { backgrounds, borders, fonts, gutters, layout } = useTheme();

  const dispatch = useDispatch();
  const { countries } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );

  const [searchedCountries, setSearchedCountries] = useState<Country[]>(
    countries.data
  );
  const [selected, setSelected] = useState<Country | null>(null);
  const [listPadding, setListPadding] = useState<number>(0);

  const buttonTitle = useMemo(() => {
    let selectedCountry = "";
    if (selected) {
      selectedCountry = `(${selected.english_name as string})`;
    }
    return `${t("common:phase.confirm")} ${selectedCountry}`;
  }, [selected]);

  const handleToggleItem = (item: Country) => {
    if (selected?.iso_3166_1 === item.iso_3166_1) {
      setSelected(null);
    } else {
      setSelected(item);
    }
  };

  const handleSearch = (text: string) => {
    if (text) {
      setSearchedCountries(
        countries.data.filter((country: Country) =>
          country.english_name?.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setSearchedCountries(countries.data);
    }
  };

  const handleConfirm = () => {
    if (selected) {
      dispatch(updateCountryFilter(selected.iso_3166_1 as string));
    }
    navigation.goBack();
  };

  const renderItem = ({ index, item }: { index: number; item: Country }) => {
    const isSelected = selected?.iso_3166_1 === item.iso_3166_1;

    return (
      <Pressable
        onPress={() => handleToggleItem(item)}
        style={[
          isSelected && backgrounds.primary400,
          gutters.padding_MEDIUM,
          index !== countries.data.length - 1 && borders.wBottom_1,
          borders.gray400,
        ]}
      >
        <Text
          style={[
            isSelected ? fonts.gray400 : fonts.white,
            isSelected
              ? fonts.size_SM_BeVietnamProSemiBold
              : fonts.size_SM_BeVietnamProRegular,
          ]}
        >
          {item.english_name}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeScreen style={[backgrounds.gray800]}>
      <View style={[gutters.padding_MEDIUM]}>
        <Input
          onChangeText={handleSearch}
          placeholder={t("search:search_country")}
        />
      </View>

      <FlatList
        data={searchedCountries}
        keyExtractor={(item: Country, index: number) =>
          item.iso_3166_1 || index.toString()
        }
        ListFooterComponent={<View style={{ height: listPadding }} />}
        renderItem={renderItem}
      />

      <View
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => setListPadding(height)}
        style={[
          layout.absolute,
          layout.bottom0,
          layout.left0,
          layout.row,
          layout.itemsCenter,
          layout.fullWidth,
          backgrounds.gray800,
          gutters.gap_LARGE,
          gutters.padding_MEDIUM,
        ]}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[fonts.size_SM_BeVietnamProSemiBold, fonts.primary400]}>
            {t("common:phase.cancel")}
          </Text>
        </Pressable>

        <View style={[layout.flex_1]}>
          <Button
            buttonStyle={[
              gutters.paddingTop_SMALL,
              gutters.paddingBottom_MEDIUM,
            ]}
            onPress={handleConfirm}
            title={buttonTitle}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

export default CountrySelectScreen;
