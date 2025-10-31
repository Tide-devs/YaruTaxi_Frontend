import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
 const router = useRouter();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState({ value: '', showPassword: false });
 const [showPasswordInput, setShowPasswordInput] = useState(false);
 const [modalVisible, setModalVisible] = useState(false);
 const [modalContent, setModalContent] = useState<'terms' | 'privacy' | null>(null);

 const handleContinue = () => {
  if (!showPasswordInput && email.includes('@')) {
   setShowPasswordInput(true);
  } else if (email && password.value) {
   // login logic here
   router.replace('/(tabs)');
  }
 };

 const handleRegister = () => {
  router.push('/auth/register'); // Redirect to the register screen
 };

 const openModal = (type: 'terms' | 'privacy') => {
  setModalContent(type);
  setModalVisible(true);
 };

 const canContinue = email.includes('@') && (!showPasswordInput || password.value.length > 3);

 return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
   <View style={styles.logoContainer}>
    <Image source={require('../../assets/images/yarutax.png')} style={styles.logo} resizeMode="contain" />
   </View>

   <Text style={styles.title}>
    Login to YaruTax
   </Text>
   <Text style={styles.subtitle}>
    {showPasswordInput
     ? 'Enter your password to continue'
     : 'Enter your email to continue'}
   </Text>

   <View style={styles.form}>
    <TextInput placeholder="email@domain.com" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />

    {showPasswordInput && (
     <View style={styles.passwordContainer}>
      <TextInput placeholder="Password" secureTextEntry={!password.showPassword} value={password.value} onChangeText={(text) => setPassword(prev => ({ ...prev, value: text }))} style={[styles.input, { flex: 1 }]} />
      <TouchableOpacity style={styles.eyeButton} onPress={() => setPassword(prev => ({ ...prev, showPassword: !prev.showPassword }))} >
       <Ionicons name={password.showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
      </TouchableOpacity>
     </View>
    )}

    <TouchableOpacity disabled={!canContinue} onPress={handleContinue} style={[styles.button, { backgroundColor: canContinue ? '#000' : '#ccc' }]} >
     <Text style={styles.buttonText}>
      {showPasswordInput ? 'Login' : 'Continue'}
     </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
     <Text style={styles.registerText}>Don't have an account? Register</Text>
    </TouchableOpacity>

    <Text style={styles.termsText}>
     By clicking continue, you agree to our{' '}
     <Text style={styles.link} onPress={() => openModal('terms')}>
      Terms of Service
     </Text>{' '}
     and{' '}
     <Text style={styles.link} onPress={() => openModal('privacy')}>
      Privacy Policy
     </Text>.
    </Text>
   </View>

   <Modal visible={modalVisible} animationType="slide">
    <View style={styles.modalContainer}>
     <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
      <Ionicons name="close" size={28} color="#000" />
     </TouchableOpacity>

     <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.modalTitle}>
       {modalContent === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
      </Text>
      <Text style={styles.modalText}>
       {modalContent === 'terms'
        ? `These terms govern the use of Yaritax, an Uber-like app that safely connects passengers with drivers.\nBy using the app, you agree to comply with the terms of service and to use the platform properly.`
        : `Our privacy policy explains how Yaritax collects, uses, and protects your personal information.\nYour data is handled confidentially and is not shared without your consent.`}
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
 registerButton: {
  marginTop: 10,
  alignItems: 'center',
 },
 registerText: {
  color: '#000',
  fontWeight: 'bold',
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
  marginBottom: 14,
  position: 'relative',
 },
 eyeButton: {
  position: 'absolute',
  right: 10,
  height: '100%',
  justifyContent: 'center',
 },
});