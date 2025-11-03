import React, { useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { deleteToken } from "@/services/api";

export default function Home() {
 const [formData, setFormData] = useState({
  from: "",
  to: "",
 });

 const handletest = () => {
  Alert.alert('Do you want to log in?', '',
   [
    { text: 'No', style: 'cancel' },
    {
     text: 'Yes',
     onPress: async () => {
      await deleteToken();
      router.push('/auth/login');
     }
    },
   ]
  );
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
   <View style={styles.header}>
    <Text style={styles.headerText}>Yarutax</Text>
    <Ionicons name="log-out-outline" size={30} color="#000" />
   </View>

   <View style={styles.body}>
    <View style={styles.bodyHeaderContainer}>
     <Image source={require("@/assets/images/icon.png")} resizeMode="contain" style={styles.bodyHeaderContainer_Map} />

     <View style={styles.bodyHeaderContainer_Form}>
      <View style={styles.inputGroup}>
       <Text style={styles.inputLabel}>From</Text>
       <TextInput placeholder="Ej: Cl. 10 #45-30" value={formData.from} onChangeText={(text) => setFormData((prev) => ({ ...prev, from: text }))} style={styles.bodyHeaderContainer_Form_Input} />
      </View>

      <View style={styles.inputGroup}>
       <Text style={styles.inputLabel}>To</Text>
       <TextInput placeholder="Ej: Centro Comercial Santafé" value={formData.to} onChangeText={(text) => setFormData((prev) => ({ ...prev, to: text }))} style={styles.bodyHeaderContainer_Form_Input} />
      </View>
     </View>
    </View>

    <View style={styles.bodyButtomContainer}>
     <TouchableOpacity style={styles.bodyButton_Button} onPress={() => handletest()}>
      <Text style={styles.bodyButton_Button_Text}>Request Now</Text>
     </TouchableOpacity>
    </View>
   </View>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#fff",
 },
 header: {
  marginTop: 50,
  paddingHorizontal: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
 },
 headerText: {
  fontSize: 20,
  fontWeight: "700",
 },
 body: {
  flex: 1,
  width: "100%",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: 20,
 },
 bodyHeaderContainer: {
  flex: 1,
  alignItems: "center",
  marginVertical: 10,
 },
 bodyHeaderContainer_Map: {
  width: "100%",
  flex: 1,
 },
 bodyHeaderContainer_Form: {
  width: "100%",
  height: "35%",
  justifyContent: "center",
  marginTop: 20,
 },
 inputGroup: {
  width: "100%",
  alignItems: "center",
  marginBottom: 10,
 },
 inputLabel: {
  width: "100%",
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
  marginBottom: 5,
 },
 bodyHeaderContainer_Form_Input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  padding: 14,
  marginBottom: 10,
  fontSize: 16,
  backgroundColor: "#f9f9f9",
 },
 bodyButtomContainer: {
  height: "auto",
  alignItems: "center",
  marginVertical: 10,
 },
 bodyButton_Button: {
  backgroundColor: "#000",
  paddingVertical: 15,
  paddingHorizontal: 50,
  borderRadius: 30,
 },
 bodyButton_Button_Text: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
 },
});