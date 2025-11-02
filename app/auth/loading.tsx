import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { getToken } from "@/services/api";

export default function AuthLoadingScreen() {
 useEffect(() => {
  const checkAuth = async () => {
   const token = await getToken()

   if (token) {
    router.push('/home/home')
   } else {
    router.push('/auth/login')
   }
  }

  console.log('test')
  checkAuth();
 }, [])

 return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
   <ActivityIndicator size="large" color="#000" />
  </View>
 )
}