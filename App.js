import React, { useEffect } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
//import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// // Manejo de las notificaciones en primer plano
// const handleForegroundMessage = async (remoteMessage) => {
//   const { notification } = remoteMessage;
//   if (notification) {
//     // Muestra la notificación cuando la app está en primer plano
//     Alert.alert(notification.title, notification.body, [{ text: 'OK' }]);
//   }
// };

// // Manejo de las notificaciones cuando la app está en segundo plano o cerrada
// const handleBackgroundMessage = async (remoteMessage) => {
//   console.log('Message handled in the background!', remoteMessage);
// };

// // Manejo de las notificaciones cuando la app se abre desde una notificación
// const handleNotificationOpenedApp = (remoteMessage) => {
//   console.log('Notification caused app to open from background state:', remoteMessage.notification);
// };

// // Manejo de las notificaciones cuando la app se abre desde un estado cerrado
// const handleInitialNotification = async () => {
//   const remoteMessage = await messaging().getInitialNotification();
//   if (remoteMessage) {
//     console.log('Notification caused app to open from quit state:', remoteMessage.notification);
//   }
// };

export default function App() {

  // useEffect(() => {
  //   // Solicitar permiso para mostrar notificaciones
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       const token = await messaging().getToken();
  //       AsyncStorage.setItem("TK-NOTY",token)
  //       console.log('FCM Token:', token);
  //     } else {
  //       console.log('Permission not granted');
  //     }
  //   };

  //   //requestUserPermission();

  //   // Configurar manejadores de mensajes
  //   messaging().onMessage(handleForegroundMessage);
  //   messaging().onNotificationOpenedApp(handleNotificationOpenedApp);
  //   messaging().setBackgroundMessageHandler(handleBackgroundMessage);

  //   // Manejar notificaciones al abrir la app desde un estado cerrado
  //   handleInitialNotification();

  //   // Limpiar las suscripciones al desmontar el componente
  //   return () => {
  //     messaging().onMessage(() => {});
  //     messaging().onNotificationOpenedApp(() => {});
  //     messaging().setBackgroundMessageHandler(() => {});
  //   };
  // }, []);

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
