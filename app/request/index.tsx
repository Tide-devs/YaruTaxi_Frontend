import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Request() {
 return (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
   <Text>Request</Text>
   <TouchableOpacity onPress={() => router.push('/home')}><Text>Cancelar solicitud</Text></TouchableOpacity>
  </View>
 );
}