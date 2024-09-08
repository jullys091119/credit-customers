import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import {Text, View, StyleSheet } from 'react-native';
import { Button } from '@ui-kitten/components';

export default function UpdatesApp() {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending
  } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;
   console.log(currentlyRunning.isEmbeddedLaunch, "is enbed launch")
  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
  ? 'Actualizando la aplicación.'
  : 'No hay actualizaciones pendientes.';

  return (
    <View style={styles.container}>
      <Text style={{marginVertical:10}}>{runTypeMessage}</Text>
      <Button onPress={() => Updates.checkForUpdateAsync()}  style={{borderWidth:0, backgroundColor: "#0093CE"}}>Buscar actualizaciones</Button>
      {showDownloadButton ? (
        <Button onPress={() => Updates.fetchUpdateAsync()} title="Bajar e instalar actualizaciones." />
      ) : null}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

})