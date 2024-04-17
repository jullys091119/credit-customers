import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { loginContext } from '../context/context';

import { Icon } from 'react-native-paper';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//screens and components
import Login from '../screens/Login';
import Home from '../components/Home';
import Perfil from '../screens/Perfil';
import Alphabet from '../components/Alphabet';
import Register from '../components/Register';


function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MainHome"
        component={Home}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="home-analytics" color="#e6008c" size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="Pefil"
        component={Perfil}
        options={{
          tabBarLabel: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="account-circle-outline" color="#e6008c" size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="Alphabet"
        component={Alphabet}
        options={{
          tabBarLabel: "Notebook",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon source="dots-grid" color="#e6008c" size={40} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
function MyStack() {
  const { tk, checkLoginStatus } = useContext(loginContext);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {tk ? (
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




export  {MyStack}  