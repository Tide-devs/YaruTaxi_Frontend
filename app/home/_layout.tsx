import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
     title: "Profile",
     tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />
    }}
   />
  </Tabs>
 );
}