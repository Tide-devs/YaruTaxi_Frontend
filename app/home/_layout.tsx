import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeLayout() {
 return (
  <Tabs screenOptions={{ headerShown: false }}>
   <Tabs.Screen
    name="index" 
    options={{
     title: "Home",
     tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />
    }}
   />
   <Tabs.Screen
    name="settings" 
    options={{
     title: "Settings",
     tabBarIcon: ({ color, size }) => <FontAwesome name="cog" size={size} color={color} />
    }}
   />
  </Tabs>
 );
}