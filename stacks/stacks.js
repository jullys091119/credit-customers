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
import Customers from '../screens/Customers';
import Reminders from '../components/Reminders';
import payUser from '../components/PayUser';
import { Sale } from '../components/Sale';


function HomeTabs() {
  const { uidUser, roles } = useContext(loginContext);
  // console.log(roles, "generando roles")
  return (
    <Tab.Navigator>
      {
        roles == undefined ?
          <>
            <Tab.Screen
              name="MainHome"
              component={Home}
              options={{
                tabBarLabel: "Home",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon source="home-analytics" color="#3366FF" size={40} />
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
                  <Icon source="account-circle-outline" color="#0093CE" size={40} />
                ),
              }}
            />
          </> :
          <>

            <Tab.Screen
              name="Creditos de clientes"
              component={Alphabet}
              options={{
                tabBarLabel: "Notebook",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon source="dots-grid" color="#0093CE" size={40} />
                ),
              }}
            />

            <Tab.Screen
              name="Ventas"
              component={Sale}
              options={{
                tabBarLabel: "Sale",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon source="sale" color="#0093CE" size={40} />
                ),
              }}
            />

            <Tab.Screen
              name="Reminders"
              component={Reminders}
              options={{
                tabBarLabel: "Reminders",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon source="message-text-clock-outline" color="#0093CE" size={37} />
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
                  <Icon source="account-circle-outline" color="#0093CE" size={40} />
                ),
              }}
            />
          </>
      }

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
      <Stack.Navigator initialRouteName='Home'>
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
          name="PayUser"
          component={payUser}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: "",
            headerShown: false,
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
        <Stack.Screen
          name="Customers"
          component={Customers}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}




export { MyStack }  