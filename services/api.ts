const baseUrl = process.env.API_BASE_URL || 'http://192.168.100.12:3000/api/';

import * as SecureStore from 'expo-secure-store';

export async function savedToken(token: string) {
 try {
  await SecureStore.setItemAsync('token', token)
 } catch (error) {
  console.error(error)
 }
}

export async function getToken() {
 try {
  return await SecureStore.getItemAsync('token')
 } catch (error) {
  console.error(error)
 }
}

export async function deleteToken() {
 try {
  await SecureStore.deleteItemAsync('token')
 } catch (error) {
  console.error(error)
 }
}

const handleError = async (response: Response) => {
 if (!response.ok) {
  const errorText = await response.json();
  throw {
   status: response.status,
   message: errorText.message || 'An error occurred',
  }
 }
 return response.json();
};

export const apiGet = async (endpoint: string) => {

 const token = await getToken();
 try {
  const response = await fetch(`${baseUrl}${endpoint}`, {
   method: 'GET',
   headers: {
    'content-type': 'application/json',
    'Authorization': token ? `${token}` : ''
   }
  });
  return handleError(response);
 } catch (error) {
  console.error('GET request error:', error);
  throw error;
 }
};

export const apiPost = async (endpoint: string, data: any, isFileUpload: boolean) => {
 const token = await getToken();
 try {
  const response = await fetch(`${baseUrl}${endpoint}`, {
   method: 'POST',
   headers: isFileUpload ? {
    'Authorization': token ? `${token}` : ''
   } : {
    'content-type': 'application/json',
    'Authorization': token ? `${token}` : ''
   },
   body: isFileUpload ? data : JSON.stringify(data)
  });
  return handleError(response);
 } catch (error) {
  console.error('POST request error:', error);
  throw error;
 }
};

export const apiPut = async (endpoint: string, data: any, isFileUpload: boolean) => {
 const token = await getToken();
 try {
  const response = await fetch(`${baseUrl}${endpoint}`, {
   method: 'PUT',
   headers: isFileUpload ? {
    'Authorization': token ? `${token}` : ''
   } : {
    'content-type': 'application/json',
    'Authorization': token ? `${token}` : ''
   },
   body: isFileUpload ? data : JSON.stringify(data)
  });
  return handleError(response);
 } catch (error) {
  console.error('PUT request error:', error);
  throw error;
 }
};