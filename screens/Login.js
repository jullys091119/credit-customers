import React, { useState, useContext, useEffect } from 'react'
import {
View,
Text,
StyleSheet,
KeyboardAvoidingView,
Image,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar} from 'react-native-paper';
import { loginContext } from '../context/context';
import { TextInput, } from 'react-native-paper';
import {ActivityIndicator} from 'react-native-paper';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({navigation}) => {
  const { login,setUser,setPass,user,pass,alertErrorsSales } = useContext(loginContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLogin = async () => {
    if(user != "" && pass != "") setIsLoaded(true)
    let status = await login()
      if (status == 200) {
        setIsLoaded(false)
        UidTokenNotify()
        sendNotification()
        navigation.navigate("HomeScreen")
        setUser("")
        setPass("")
      } 
      if (status == 403) {
        alertErrorsSales("Usuario o clave invalidos")
        setIsLoaded(false)
        setUser("")
        setPass("")
      }

      if(user.length > 0 && pass.length > 0 && status == 400) {
        alertErrorsSales("Cuenta inactiva, bloqueada o nula")
        setIsLoaded(false)
      }

      if([user,pass].includes("")) {
        alertErrorsSales("Rellena los campos")
      }
  };

  const openRegister = async () => {
    try {
      navigation.navigate("Register")
    } catch (error) {
     console.log(error)
    }
  };

  const UidTokenNotify = async () => {
    const UID = await AsyncStorage.getItem("@UID")
    // Native Notify Indie Push Registration Code
    registerIndieID(UID.toString(), 23061, 'op0fHTEFY2CT43w3D4WvXA');
    // End of Native Notify Code
  }

  
  const sendNotification = async (message) => {
    const UID = await AsyncStorage.getItem("@UID")
    const name = await AsyncStorage.getItem('@NAMEUSER')
    try {
        await axios.post('https://app.nativenotify.com/api/indie/notification', {
            subID: UID,                // ID único del usuario de aplicación
            appId: 23061,                // ID de tu aplicación en Native Notify
            appToken: 'op0fHTEFY2CT43w3D4WvXA', // Token de tu aplicación en Native Notify
            title: `Bienvenid@ ${name}`,                // Título de la notificación push
            message: message             // Mensaje de la notificación push
        });
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
  };



  const AvataLogin = () => (
    <TouchableOpacity onPress={()=> {handleLogin()}}>
      <Avatar.Icon size={69} style={[styles.iconGo]} color='white' icon="login"/>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={[styles.container]}>
      <View style={[styles.containerWelcome]}>
        <View>
          <Image source={require('../assets/images/tienda.png')} style={{width: 60, height: 60}}/>
        </View>
        <View>
          <Text style={{fontSize: 40, fontWeight: "600"}}>Hola,</Text>
          <Text style={{fontSize: 20}}>Por favor entra</Text>
          <Text style={{fontSize: 20}}>a tu cuenta!</Text>
        </View>
      </View>
      <View>
        <TextInput
          mode='flat'
          label="Usuario"
          onChangeText={txt => setUser(txt)}
          value={user}
          style={[styles.input]}
        />
        <TextInput
          mode='flat'
          secureTextEntry={!showPassword?true:false}
          label="Clave"
          value={pass}
          onChangeText={txt => setPass(txt)}
          right={<TextInput.Icon icon={showPassword?"eye":"eye-off-outline"} placeholder='Password' onPress={() => {setShowPassword(!showPassword)}} />}
          style={[styles.input]}
        />
        <TouchableOpacity style={{height: 50, backgroundColor: "#2196F3", padding: 10, marginVertical: 30}} onPress={handleLogin}>
          <ActivityIndicator color="white" animating={isLoaded} style={styles.activityIndicator} />
          <Text style={[styles.loginText]}>{isLoaded?null:"Entrar"}</Text>
        </TouchableOpacity>
        <View style={[styles.containerSingUp]}>
          <Text>No tienes una cuenta?</Text><TouchableOpacity><Text style={[styles.singup]} onPress={openRegister}>Registrate</Text></TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  input: {
    width: 300,
    marginVertical: 10,
    backgroundColor: "none"
  },
  button: {
    height: 30
  },
  containerWelcome: {
    marginHorizontal: 34,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems:"center",
    gap: 80,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight:"500",
    textAlign: "center",
  },
  singup: {
    fontSize: 20,
    color: "#2196F3"
  },
  containerSingUp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activityIndicator: {
    position: "absolute",
    left: "50%",
    top: 10
  }

})
export default Login


