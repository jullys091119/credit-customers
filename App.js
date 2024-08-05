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
import messaging from "@react-native-firebase/messaging"



export default function App() {
 
  const requestUserPermission = async () => {
    const authStatus = await  messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if(enabled) {
      console.log("Autorizathion status", authStatus)
    }
  }

  useEffect(()=> {
    if(requestUserPermission()) {
      messaging().getToken().then((token)=> {
        console.log(token, "tokeeen")
      })
    } else {
      console.log("Permission not granted", authStatus)
    }

    //check ehether an initial notification is available
    messaging().getInitialNotification().then(async(remoteMessage)=> {
      if(remoteMessage) {
        console.log("Notification caused app to open from quit state",remoteMessage.notification)
      }
    })  

   //Assume a message-notification container a "Type" property in the data payload of the screen

    messaging().onNotificationOpenedApp((remoteMessage)=> {
      console.log("NOtification caused app to open from background state", remoteMessage.notification)
    })


    messaging().setBackgroundMessageHandler(async(remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage)
    })


    const unsubscribe =  messaging().onMessage(async(remoteMessage)=> {
      Alert.alert("A new FCM message arrived", JSON.stringify(remoteMessage))
    })
   
    return unsubscribe

  },[])

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
