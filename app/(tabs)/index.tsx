import { getToken } from '@/services/api';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // delay de 1/2s

      const token = await getToken();

      if (token) {
        const decoded: any = jwtDecode(token)
        if (decoded && decoded.type === 'login') {
          router.push('/home')
        } else {
          router.push('/auth/login')
        }
      } else {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#000' />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});