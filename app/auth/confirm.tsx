import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';

import { getToken } from '@/services/api';

const baseUrl = process.env.API_BASE_URL || 'http://192.168.100.12:3000/api/';

export default function ConfirmRegister() {
 const router = useRouter();
 const [ConfirmCode, setConfirmCode] = React.useState('');

 const canConfirm = ConfirmCode.length === 6;

 const handleRegister = async () => {
  const token = await getToken();
  try {
   const response = await fetch(`${baseUrl}users/register/verify`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     'Authorization': token ? `${token}` : ''
    },
    body: JSON.stringify({
     verificationCode: ConfirmCode,
    }),
   });
   await response.json();
   if (response.ok) {
    Alert.alert('Success', 'Your account has been confirmed!', [
     { text: 'OK', onPress: () => router.push('/auth/login') }
    ]);
   }
  } catch (error) {
   Alert.alert('Error', 'There was an error confirming your account. Please try again.');
   console.error('Confirmation error:', error);
  }
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
   <View style={styles.logoContainer}>
    <Image source={require('../../assets/images/yarutax.png')} style={styles.logo} resizeMode="contain" />
   </View>

   <Text style={styles.title}>Confirm your account</Text>
   <Text style={styles.subtitle}>Enter the confirmation code sent to your email.</Text>

   <View style={styles.form}>
    <View style={styles.row}>
     <TextInput placeholder="Confirmation Code" style={styles.input} value={ConfirmCode} onChangeText={(text) => setConfirmCode(text)} />

     <TouchableOpacity disabled={!canConfirm} onPress={handleRegister} style={[styles.button, { backgroundColor: canConfirm ? '#000' : '#ccc' }]}>
      <Text style={styles.buttonText}>Register</Text>
     </TouchableOpacity>
    </View>
   </View>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  paddingHorizontal: 24,
  justifyContent: 'center',
 },
 logoContainer: {
  alignItems: 'center',
  marginBottom: 40,
 },
 logo: {
  width: 180,
  height: 80,
 },
 title: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 6,
 },
 subtitle: {
  textAlign: 'center',
  color: '#666',
  marginBottom: 24,
 },
 form: {
  width: '100%',
 },
 row: {
  flexDirection: 'column',
 },
 input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  padding: 14,
  marginBottom: 14,
  fontSize: 16
 },
 button: {
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 100,
 },
 buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
 },
});