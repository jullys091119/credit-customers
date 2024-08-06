import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configura el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState();
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // Configurar listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Manejar la respuesta de la notificación
      redirect(response.notification);
    });

    // Limpiar listeners al desmontar el componente
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    // Obtener el token de notificación
    registerForPushNotificationsAsync().then(async token => {
      setExpoPushToken(token);
      await AsyncStorage.setItem('NOTIFY-TK', token);

      const previousToken = await AsyncStorage.getItem("NOTIFY-TK");
      if (previousToken !== token) {
        updateTokenInBackend(token);
      }
    });
  }, []);

  // Función para actualizar el token en el backend
  async function updateTokenInBackend(token) {
    const tk = await AsyncStorage.getItem('@TOKEN');
    try {
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: 'Authorization: Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': tk,
        },
        data: {
          data: { 
            type: 'node--notification-push',
            attributes: {
              title: 'tokens guardados',
              field_token: token,
            },
          },
        },
      };
     
      const response = await axios.request(options);
      console.log('Token actualizado en el backend:', response.data);
    } catch (error) {
      console.error('Error al enviar el token al backend:', error);
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <ProviderLogin>
          <PaperProvider>
            <MyStack />
          </PaperProvider>
        </ProviderLogin>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
