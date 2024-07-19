// notifications.js

import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para enviar notificaciones push
export async function sendPushNotification(expoPushToken, msg) {
  console.log(expoPushToken, msg, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

  const token = await AsyncStorage.getItem('@TOKEN'); // Obtener el token necesario para tu API de backend
console.log(token, "tokennnn")
  const message = {
    to: expoPushToken,
    sound: Platform.OS === 'android' ? 'default' : 'tono.mp3',
    title: "Abarrotes Juliancito",
    body: msg,
    data: { someData: 'goes here' },
    channelId: 'default',
  };

  try {
    // Enviar el token a Drupal o cualquier otro backend
    const options = {
      method: 'POST',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
        'X-CSRF-Token': token,
      },
      data: {
        data: {
          type: 'node--notification-push',
          attributes: {
            title: "Guardando token",
            field_token: expoPushToken,
          },
        },
      },
    };

    const response = await axios.request(options);
    if (response) {
      console.log('Respuesta de Drupal:', response.data);
    }

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
