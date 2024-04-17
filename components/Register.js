import React, { useState,useContext } from "react";
import { loginContext } from "../context/context";

import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";





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
      navigation.navigate("Login")
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
    <View style={styles.container}>
      <View style={styles.createAccount}>
        <Text style={styles.textNewAccount}>Ya casi terminamos</Text>
        <Text style={(styles.textNewAccount, [styles.textStyles])}>
          !Completa tu informacion!
        </Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          label="Correo electronico"
          value={emailUser}
          onChangeText={(txt)=>{setEmailUser(txt)}}
          accessoryLeft={(props) => <IconEmail {...props} />}
        />
        <TextInput
          label="Usuario"
          value={nameUser}
          style={styles.input}
          onChangeText={(txt)=>{setNameUser(txt)}}
          accessoryLeft={(props) => <IconUser {...props} />}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={()=> {handleRegister()}}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 45,
  },
  createAccount: {
    marginVertical: 60,
  },
  textNewAccount: {
    textAlign: "center",
    fontSize: 40,
  },
  textStyles: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
  },
  input: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    backgroundColor: "none",
    borderColor: "gray",
    marginVertical: 15,
    borderRadius: 0,
  },
  loginButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  login: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
  },
});

export default Register;