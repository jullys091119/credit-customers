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
  
  
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      
    }
  }


  useEffect(() => {

    if(requestUserPermission()) {
        messaging()
        .getToken()
        .then((token)=> {
          console.log(token)
        })
      } else {
        console.log("Permission not granted", authStatus)
    }

    messaging()
    .getInitialNotification()
    .then(async (remoteMessage)=> {
      if(remoteMessage) {
        console.log("Notification caused app to open from quit state", remoteMessage)
      }
    })

   
    messaging().onNotificationOpenedApp((remoteMessage)=> {
      console.log("Notification caused app to open from background state", remoteMessage.notification)
    })


    messaging().setBackgroundMessageHandler(async (remoteMessage)=> {
      console.log("Message handled in the background!",remoteMessage)
    })

    const unsubscribe = messaging().onMessage(async(remoteMessage)=> {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage))
    })

    
    return unsubscribe

      
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
