import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeLayout() {
 return (
  <Tabs screenOptions={{ headerShown: false }}>
   <Tabs.Screen
    name="index" // o "home" según tu archivo: app/home/index.tsx -> "index"
    options={{
     title: "Inicio",
     tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />
    }}
   />
   <Tabs.Screen
    name="settings" // ejemplo: app/home/settings.tsx
    options={{
     title: "Ajustes",
     tabBarIcon: ({ color, size }) => <FontAwesome name="cog" size={size} color={color} />
    }}
   />
  </Tabs>
 );
}