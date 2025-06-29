import { useTheme } from "@/shared/hook";
import { moderateScale } from "@/shared/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import { MotiView } from "moti";
import type { ViewStyle } from "react-native";

interface LoaderProps {
  loaderStyle?: ViewStyle | ViewStyle[];
  size: number;
}

const Loader = ({ loaderStyle = {}, size }: LoaderProps) => {
  const { colors } = useTheme();

  return (
    <MotiView
      animate={{
        borderRadius: moderateScale((size + 20) / 2),
        borderWidth: moderateScale(size / 10),
        height: moderateScale(size + 20),
        shadowOpacity: 1,
        width: moderateScale(size + 20),
      }}
      from={{
        borderRadius: moderateScale(size / 2),
        borderWidth: 0,

        height: moderateScale(size),
        shadowOpacity: 0.5,
        width: moderateScale(size),
      }}
      style={[
        {
          borderColor: colors.primary400,
          borderRadius: size / 2,
          borderWidth: moderateScale(size / 10),
          height: moderateScale(size),
          shadowColor: colors.primary400,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          width: moderateScale(size),
          ...loaderStyle,
        },
      ]}
      transition={{
        duration: 1000,
        loop: true,
        repeatReverse: false,
        type: "timing",
      }}
    />
  );
};

export default Loader;
