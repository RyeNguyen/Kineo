import type { Paths } from "@/navigation/paths";
import { SafeScreen } from "@/shared/components/molecules";
import { useTheme } from "@/shared/hook";
import type { RootScreenProps } from "@/types";
import { FlatList, Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { MovieState } from "../store/movieSlice";
import type { Country } from "../models/movie.model";

const CountrySelectScreen = ({
  navigation,
}: RootScreenProps<Paths.SelectCountry>) => {
  const { backgrounds } = useTheme();

  const { countries } = useSelector(
    (state: { movie: MovieState }) => state.movie
  );

  const renderItem = ({ item }: { item: Country }) => {
    return (
      <View>
        <Text>{item.english_name}</Text>
      </View>
    );
  };

  return (
    <SafeScreen style={[backgrounds.gray400]}>
      <FlatList
        data={countries.data}
        keyExtractor={(item: Country, index: number) =>
          item.iso_3166_1 || index.toString()
        }
        renderItem={renderItem}
      />
    </SafeScreen>
  );
};

export default CountrySelectScreen;
