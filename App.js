import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    // Request permissions and get a token
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.error('Failed to get push token for push notification!');
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await AsyncStorage.setItem("NOTIFY-TK", token);
        console.log('Expo Push Token:', token);
      } catch (error) {
        console.error('Error requesting permissions or getting token:', error);
      }
    };
    requestPermissions();

    // Handle foreground notifications
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // Puedes agregar lógica aquí para mostrar un mensaje o actualizar el estado
    });

    // Handle notification clicks
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
      const data = response.notification.request.content.data;
      if (data && data.screen) {
        // navigation.navigate(data.screen); // Asegúrate de tener acceso a la función de navegación
      }
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
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
