import { Stack, Tabs } from "expo-router";

export default function RequestLayout() {
 return (
  <Tabs screenOptions={{ headerShown: false }}>
   <Stack.Screen name="index" />
  </Tabs>
 );
}