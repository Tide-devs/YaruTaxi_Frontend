import Constants from "expo-constants";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

import { deleteToken, getToken, savedToken } from "@/services/api";
import { router } from "expo-router";

const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL;

export default function Recover() {
   const [email, setEmail] = useState("");
   const [recoverCode, setRecoverCode] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");

   const [showCodeInput, setShowCodeInput] = useState(false);
   const [showPasswordInputs, setShowPasswordInputs] = useState(false);

   const handleContinue = async () => {
      if (!showCodeInput && !showPasswordInputs) {
         try {
            const response = await fetch(`${baseUrl}auth/recover`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
               await savedToken(data.token);
               setShowCodeInput(true);
               Alert.alert("Email Sent", "A password recovery code has been sent to your email address.");
            }
         } catch (error) {
            console.error(error);
         }
         return;
      }

      if (showCodeInput && !showPasswordInputs) {
         const token = await getToken();
         try {
            const response = await fetch(`${baseUrl}auth/recover/verify`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  authorization: token ? `${token}` : "",
               },
               body: JSON.stringify({
                  email,
                  recoveryCode: recoverCode,
               }),
            });

            const data = await response.json();
            if (response.ok) {
               await savedToken(data.token);
               setShowPasswordInputs(true);
               setShowCodeInput(false);
               Alert.alert("Code Verified", "Now you can set a new password.");
            } else {
               Alert.alert("Invalid Code", "The verification code is incorrect or expired.");
            }
         } catch (error) {
            console.error(error);
         }
         return;
      }

      if (showPasswordInputs) {
         if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
         }

         const token = await getToken();
         try {
            const response = await fetch(`${baseUrl}auth/recover/change`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  authorization: token ? `${token}` : "",
               },
               body: JSON.stringify({
                  newPassword: newPassword
               }),
            });

            await response.json()

            if (response.ok) {
               await deleteToken()
               Alert.alert("Password Updated", "Your password has been successfully reset.");
               setShowPasswordInputs(false);
               setEmail("");
               setRecoverCode("");
               setNewPassword("");
               setConfirmPassword("");
               router.push('/')
            } else {
               Alert.alert("Error", "Something went wrong while resetting your password.");
            }
         } catch (error) {
            console.error(error);
         }
      }
   };

   const canContinue =
      (!showCodeInput && !showPasswordInputs && /\S+@\S+\.\S+/.test(email)) ||
      (showCodeInput && recoverCode.length >= 4) ||
      (showPasswordInputs && newPassword.length >= 6 && confirmPassword.length >= 6);

   return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} >
         <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/yarutax.png")} style={styles.logo} resizeMode="contain" />
         </View>

         <Text style={styles.title}>Recover Password</Text>
         <Text style={styles.subtitle}>
            {!showCodeInput && !showPasswordInputs
               ? "Enter your email to receive a recovery code."
               : showCodeInput
                  ? "Enter the verification code sent to your email."
                  : "Enter your new password below."}
         </Text>

         <View style={styles.form}>
            {!showCodeInput && !showPasswordInputs && (
               <TextInput placeholder="email@domain.com" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
            )}

            {showCodeInput && (
               <TextInput placeholder="Verification code" keyboardType="number-pad" value={recoverCode} onChangeText={setRecoverCode} style={styles.input} />
            )}

            {showPasswordInputs && (
               <>
                  <TextInput placeholder="New password" secureTextEntry value={newPassword} onChangeText={setNewPassword} style={styles.input} />
                  <TextInput placeholder="Confirm new password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
               </>
            )}
         </View>

         <TouchableOpacity disabled={!canContinue} onPress={handleContinue} style={[styles.button, { backgroundColor: canContinue ? "#000" : "#aaa" },]} >
            <Text style={styles.buttonText}>
               {!showCodeInput && !showPasswordInputs
                  ? "Send Code"
                  : showCodeInput
                     ? "Verify Code"
                     : "Save New Password"}
            </Text>
         </TouchableOpacity>
      </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 24,
      justifyContent: "center",
   },
   logoContainer: {
      alignItems: "center",
      marginBottom: 40,
   },
   logo: {
      width: 180,
      height: 80,
   },
   title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 6,
   },
   subtitle: {
      textAlign: "center",
      color: "#666",
      marginBottom: 24,
   },
   form: {
      width: "100%",
   },
   input: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      fontSize: 16,
   },
   button: {
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
   },
   buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
   },
});