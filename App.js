import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export default function App() {
  
  useEffect(() => {
    // Función para solicitar permiso de usuario para notificaciones
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
        if (enabled) {
          console.log('Authorization status:', authStatus);
          const token = await messaging().getToken();
          console.log('Firebase token:', token);
        } else {
          console.log('Permission not granted');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    // Llamar a la función para solicitar permiso
    requestUserPermission();

    // Función para manejar la notificación cuando la aplicación está abierta
    const handleForegroundNotification = async (remoteMessage) => {
      console.log('Notification received in foreground:', remoteMessage.notification);
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    };

    // Función para manejar la notificación cuando la aplicación está en segundo plano
    const handleBackgroundNotification = async (remoteMessage) => {
      console.log('Notification opened from background:', remoteMessage.notification);
    };

    // Configurar los listeners para manejar las notificaciones
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      handleForegroundNotification(remoteMessage);
    });

    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      handleBackgroundNotification(remoteMessage);
    });

    const unsubscribeOpenApp = messaging().onNotificationOpenedApp((remoteMessage) => {
      handleBackgroundNotification(remoteMessage);
    });

    // Manejar la notificación inicial si la aplicación se abre desde una notificación
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          handleBackgroundNotification(remoteMessage);
        }
      });

    // Limpiar los listeners al desmontar el componente
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeOpenApp();
    };

  }, []);

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
