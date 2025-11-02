import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {

 return (
  <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ paddingBottom: 80 }} >
   <View style={{ marginTop: 50, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }} >
    <Text style={{ fontSize: 20, fontWeight: "700" }}>Yarutax</Text>
    <Ionicons name="person-circle-outline" size={30} color="#000" />
   </View>

   {/* Main Button */}
   <View style={{ alignItems: "center", marginVertical: 10 }}>
    <TouchableOpacity style={{ backgroundColor: "#0040ff", paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30, }} >
     <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
      Request Now
     </Text>
    </TouchableOpacity>
   </View>
  </ScrollView>
 );
}