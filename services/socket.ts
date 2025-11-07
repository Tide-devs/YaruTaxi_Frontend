import Constants from 'expo-constants';
import { io } from 'socket.io-client';
import { getToken } from './api';
// Tomás la URL desde tus variables de entorno de Expo
const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL_SOCKET || 'http://192.168.100.12:3000';

// Instancia del socket sin conectarse de inmediato
export const socket = io(baseUrl, {
 transports: ['websocket'],
 autoConnect: false,
});

// Conexión manual: solo si hay token
export const connectSocket = async () => {
 try {
  const token = await getToken();
  if (!token) return;

  socket.connect();
  socket.emit('auth:login', token);
 } catch (err) {
  console.log('❌ Error al conectar socket:', err);
 }
};

// Desconexión manual: al cerrar sesión
export const disconnectSocket = async () => {
 try {
  const token = await getToken();
  if (socket.connected && token) {
   socket.emit('auth:logout', token);
   socket.disconnect();
  }
 } catch (err) {
  console.log('❌ Error al desconectar socket:', err);
 }
};
