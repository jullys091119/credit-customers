// App.js

import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendPushNotification } from './notifications'; // Importar la función de notificaciones
import * as Notifications from 'expo-notifications'; // Importar Notifications desde Expo

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Permission not granted to receive push notifications!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (token) {
      setExpoPushToken(token);
      console.log(token);
    }
    return token;
  }
   

  // Función para enviar una notificación cuando se obtiene el token
  useEffect(() => {
    if (expoPushToken) {
      sendPushNotification(expoPushToken, 'Bienvenid@', '¡Gracias por usar nuestra aplicación!');
    }
  }, [expoPushToken]);

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
