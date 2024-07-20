// notifications.js

import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para enviar notificaciones push
export async function sendPushNotification(expoPushToken, msg) {
  console.log(expoPushToken, msg, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

  const token = await AsyncStorage.getItem('@TOKEN'); // Obtener el token necesario para tu API de backend
  const message = {
    to: expoPushToken,
    sound: Platform.OS === 'android' ? 'default' : 'tono.mp3',
    title: "Abarrotes Juliancito",
    body: msg,
    data: { someData: 'goes here' },
    channelId: 'default',
  };

  try {
    

    // Enviar notificación a Expo
    const expoResponse = await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });

    console.log('Notificación enviada a Expo:', expoResponse.data);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
}
