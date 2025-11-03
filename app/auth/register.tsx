import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

import { savedToken } from '../../services/api';
import { termsOfService } from '@/assets/files/legal';

const baseUrl = process.env.API_BASE_URL || 'http://192.168.100.12:3000/api/';

export default function RegisterScreen() {
 const router = useRouter();
 const [formData, setFormData] = useState({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
 });
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [acceptTerms, setAcceptTerms] = useState(false);
 const [modalVisible, setModalVisible] = useState(false);

 const handleRegister = async () => {
  try {
   const response = await fetch(`${baseUrl}users/register`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     name: formData.name,
     lastName: formData.lastname,
     email: formData.email,
     password: formData.password,
     phone: formData.phone,
    }),
   });
   const data = await response.json();
   if (response.ok) {
    await savedToken(data.token);
    Alert.alert('Success', 'Registration successful! Please confirm your account.', [
     { text: 'OK', onPress: () => router.push('/auth/confirm') }
    ]);
   }
  } catch (error) {
   Alert.alert('Error', 'There was an error during registration. Please try again.');
   console.error('Registration error:', error);
  }
 };

 const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~]).{8,}$/;

 const canRegister =
  formData.name.trim() !== '' &&
  formData.lastname.trim() !== '' &&
  /\S+@\S+\.\S+/.test(formData.email) &&
  /^\d+$/.test(formData.phone) &&
  formData.phone.length >= 7 &&
  strongPasswordRegex.test(formData.password) &&
  formData.password === formData.confirmPassword &&
  acceptTerms;

 return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
   <View style={styles.logoContainer}></View>

   <View style={styles.logoContainer}>
    <Image source={require('../../assets/images/yarutax.png')} style={styles.logo} resizeMode="contain" />
   </View>

   <Text style={styles.title}>Create Account</Text>
   <Text style={styles.subtitle}>Join YaruTax today! Start traveling easily and affordably.</Text>

   <View style={styles.form}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
     <TextInput placeholder="Name" value={formData.name} onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))} style={[styles.input, { flex: 1, marginRight: 8 }]} />

     <TextInput placeholder="Last Name" value={formData.lastname} onChangeText={(text) => setFormData(prev => ({ ...prev, lastname: text }))} style={[styles.input, { flex: 1 }]} />
    </View>

    <TextInput placeholder="Email" keyboardType="email-address" value={formData.email} onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))} autoCapitalize="none" style={styles.input} />

    <TextInput placeholder="Phone" keyboardType="phone-pad" value={formData.phone} onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))} style={styles.input} />

    <View style={styles.passwordContainer}>
     <TextInput placeholder="Password" secureTextEntry={!showPassword} value={formData.password} onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))} style={[styles.input, { flex: 1 }]} />
     <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
     </TouchableOpacity>
    </View>

    <View style={styles.passwordContainer}>
     <TextInput placeholder="Confirm Password" secureTextEntry={!showConfirmPassword} value={formData.confirmPassword} onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))} style={[styles.input, { flex: 1 }]} />
     <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
      <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
     </TouchableOpacity>
    </View>

    <View style={styles.checkboxContainer}>
     <Checkbox value={acceptTerms} onValueChange={setAcceptTerms} color={acceptTerms ? '#000' : undefined} style={{ width: 22, height: 22, marginRight: 12, borderRadius: 4 }} />
     <Text style={[styles.termsText, { textAlign: 'left', marginTop: 0 }]}>
      I accept the{' '}
      <Text style={styles.link} onPress={() => setModalVisible(true)}>
       Terms of Service
      </Text>
     </Text>
    </View>

    <TouchableOpacity disabled={!canRegister} onPress={handleRegister} style={[styles.button, { backgroundColor: canRegister ? '#000' : '#ccc' }]} >
     <Text style={styles.buttonText}>Register</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.back()}>
     <Text style={styles.loginText}>Already have an account? Login</Text>
    </TouchableOpacity>
   </View>

   <Modal visible={modalVisible} animationType="slide">
    <View style={styles.modalContainer}>
     <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
      <Ionicons name="close" size={28} color="#000" />
     </TouchableOpacity>

     <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.modalTitle}>
       Privacy Policy
      </Text>
      <Text style={styles.modalText}>
       {termsOfService}
      </Text>
     </ScrollView>
    </View>
   </Modal>
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
  borderRadius: 10,
  alignItems: 'center',
 },
 buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
 },
 termsText: {
  fontSize: 12,
  color: '#666',
  textAlign: 'center',
  marginTop: 20,
 },
 link: {
  color: '#000',
  fontWeight: 'bold',
 },
 modalContainer: {
  backgroundColor: '#fff',
  margin: 20,
  marginTop: 'auto',
  marginBottom: 'auto',
  borderRadius: 15,
  padding: 20,
  maxHeight: '80%',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: {
   width: 0,
   height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
 },
 closeButton: {
  alignSelf: 'flex-end',
  marginBottom: 10,
 },
 modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 10,
 },
 modalText: {
  fontSize: 15,
  color: '#444',
  lineHeight: 22,
 },
 passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
 },
 eyeButton: {
  position: 'absolute',
  right: 10,
  height: '100%',
  justifyContent: 'center',
 },
 checkboxContainer: {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20
 },
 loginText: {
  textAlign: 'center',
  marginTop: 20,
  color: '#000',
  fontWeight: 'bold',
 },
});