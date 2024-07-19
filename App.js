import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Updates from 'expo-updates';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendPushNotification(expoPushToken, msg) {
  console.log(expoPushToken, msg, ">>>>>>>>>>>>>>>>")
  const token = await AsyncStorage.getItem('@TOKEN');
  const message = {
    to: expoPushToken,
    sound: Platform.OS === 'android' ? 'default' : 'tono.mp3', // Sonido personalizado para iOS
    title: 'Abarrotes Juliancito',
    body: msg,
    data: { someData: 'goes here' },
    channelId: Platform.OS === 'android' ? 'custom-sound-channel' : undefined, // Canal personalizado para Android
  };

  try {
    // Enviar el token a Drupal
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
            title: 'tokens guardados',
            field_token: expoPushToken,
          },
        },
      },
    };

    const response = await axios.request(options);
    if (response) {
      // console.log(response);
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

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('custom-sound-channel', {
      name: 'Custom Sound Channel',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'tono.mp3',
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
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log('Expo Push Token:', pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`Error getting Expo Push Token: ${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const setToken = async (tk) => {
    console.log(tk, "toen")
   await AsyncStorage.setItem("NOTIFY-TK", tk)
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => { 
      if (token) {
        setExpoPushToken(token);
        sendPushNotification(token, 'Bienvenid@ \u263A'); 
        setToken(token)
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
