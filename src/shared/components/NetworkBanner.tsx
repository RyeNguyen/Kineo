import { useSelector } from "react-redux";
import { Text, View } from "react-native";

export default function NetworkBanner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isConnected = useSelector((state: any) => state.network.isConnected);

  if (isConnected) {return null;}

  return (
    <View style={{ backgroundColor: "red", padding: 10 }}>
      <Text style={{ color: "white", textAlign: "center" }}>No Internet Connection</Text>
    </View>
  );
}
