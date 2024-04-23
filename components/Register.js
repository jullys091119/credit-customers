import React, { useEffect, useState, useContext } from 'react'
import tw from 'twrnc';
import {
View,
Text,
StyleSheet,
KeyboardAvoidingView,
Image,
Button
} from 'react-native'
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar} from 'react-native-paper';
import { loginContext } from '../context/context';
import { Icon,TextInput, } from 'react-native-paper';


const Register = ({ navigation }) => {
  const [emailUser, setEmailUser] = useState("")
  const [nameUser, setNameUser] = useState("")
  const {tk} = useContext(loginContext)

  const  handleRegister = () => {
    const options = {
      method: 'POST',
      url: 'https://elalfaylaomega.com/credit-customer/user/register?_format=json',
      params: { _format: 'json' },
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': tk },
      data: {
        name: [{ value: nameUser }],
        mail: [{ value: emailUser }],
      }
    } 

    axios.request(options).then(function (response) {
      console.log(response.data);
      navigation.navigate("LoginScreen")
    }).catch(function (error) {
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx 
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        console.log(error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }
 
  return (
    <KeyboardAvoidingView style={[styles.container]}>
    <View style={[styles.containerWelcome]}>
      <View>
        <Image source={require('../assets/images/registered.png')} style={{width: 60, height: 60}}/>
      </View>
      <View>
        <Text style={{fontSize: 40, fontWeight: "600"}}>Hello,</Text>
        <Text style={{fontSize: 20}}>Please Register</Text>
        <Text style={{fontSize: 20}}>Your Account!</Text>
      </View>
    </View>
    <View>

      <TextInput
        mode='flat'
        label="Valid Email Address"
        onChangeText={txt => setEmailUser(txt)}
        value={emailUser}
        style={[styles.input]}
      />

      <TextInput
        mode='flat'
        label="User name"
        onChangeText={txt => setNameUser(txt)}
        value={nameUser}
        style={[styles.input]}
        
      />
     
      <TouchableOpacity style={{height: 50, backgroundColor: "#2196F3", padding: 10, marginVertical: 30}} onPress={handleRegister}>
        <Text style={[styles.loginText]}>Register</Text>
      </TouchableOpacity>
  
    </View>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    alignSelf: "flex-start",
    marginHorizontal: 34,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems:"center",
    gap: 80
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
    gap: 10
  }
});

export default Register;