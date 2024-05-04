import React, { useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import * as Updates from 'expo-updates';

export default function App() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      console.log(update)

      if (!update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <ProviderLogin>
          <PaperProvider>
            {updateAvailable ? (
              <View style={styles.updateMessageContainer}>
                <Text style={styles.updateMessageText}>
                  Hay una actualización disponible. Por favor, reinicia la aplicación para aplicarla.
                </Text>
              </View>
            ) : null}
            <MyStack />
          </PaperProvider>
        </ProviderLogin>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  updateMessageContainer: {
    backgroundColor: 'yellow',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  updateMessageText: {
    fontSize: 16,
  },
});
