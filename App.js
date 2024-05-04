import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MyStack } from './stacks/stacks';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProviderLogin } from './context/context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components'

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="auto" />
      <ApplicationProvider {...eva} theme={eva.light}>
        <ProviderLogin>
          <PaperProvider >
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
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
