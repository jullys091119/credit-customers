import React, { useEffect, useState, useContext } from 'react'
import tw from 'twrnc';
import {
View,
Text,
StyleSheet,
KeyboardAvoidingView,
Image,
Button,
Alert
} from 'react-native'
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar} from 'react-native-paper';
import { loginContext } from '../context/context';
import { Icon,TextInput, } from 'react-native-paper';
import {ActivityIndicator} from 'react-native-paper';


const Register = ({ navigation }) => {
  const [emailUser, setEmailUser] = useState("")
  const [nameUser, setNameUser] = useState("")
  const {tk,alertErrorsSales} = useContext(loginContext)
  const [isLoaded, setIsLoaded] = useState(false)
  const [emailvalid, setEmailValid] = useState(false)
  const [errorRegister, setErrorRegister] = useState("")

  const  handleRegister = () => {
    setIsLoaded(true)
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
      navigation.navigate("LoginScreen")
      setIsLoaded(false)
      setNameUser("")
      setEmailUser("")
      setEmailValid(false)
    }).catch(function (error) {
      let errorRegister = error.response.data.message;
      console.log(errorRegister)
      if([nameUser,emailUser].includes("")) {
        setIsLoaded(false)
        alertErrorsSales("Debes poner un usuario o correo")
      } else if(error.request.status == 422) {
        setIsLoaded(false)
        setNameUser("")
        setEmailUser("")
        if(errorRegister.includes("name")) {
          errorRegister = "El usuario ya existe"
          alertErrorsSales(errorRegister)
        } 
        if (errorRegister.includes(`${emailUser}`)) {
          errorRegister = "El correo ya existe"
          alertErrorsSales(errorRegister)
          setEmailValid(false)
        }
        
        if( errorRegister.includes("mail.0.value")) {
          setEmailValid(true)
        }
        
      } 
      
    });

  }

  const ValidateEmail = ({email}) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return (
        <Text style={{color: "red"}}>Error, Introduce una dirección de correo  válido.</Text>
      )
    } 
  };
 
  return (
    <KeyboardAvoidingView style={[styles.container]}>
    <View style={[styles.containerWelcome]}>
      <View>
        <Image source={require('../assets/images/registered.png')} style={{width: 60, height: 60}}/>
      </View>
      <View>
        <Text style={{fontSize: 40, fontWeight: "600"}}>Hola,</Text>
        <Text style={{fontSize: 20}}>Por favor Registra</Text>
        <Text style={{fontSize: 20}}>Tu Cuenta!</Text>
      </View>
    </View>
    <View>
      <TextInput
        mode='flat'
        label="Email Valido"
        onChangeText={txt => setEmailUser(txt)}
        value={emailUser}
        style={[styles.input]}
      />
      {emailvalid?<ValidateEmail email={emailUser}/>:""}

      <TextInput
        mode='flat'
        label="Nombre Usuario"
        onChangeText={txt => setNameUser(txt)}
        value={nameUser}
        style={[styles.input]}
        
      />
     
      <TouchableOpacity style={{height: 50, backgroundColor: "#2196F3", padding: 10, marginVertical: 30}} onPress={handleRegister}>
        <ActivityIndicator color="white" animating={isLoaded} style={styles.activityIndicator}/>
        <Text style={[styles.loginText]}>{isLoaded?null:"Entrar"}</Text>
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
  },
  activityIndicator: {
    position: "absolute",
    left: "50%",
    top: 10
  }
});

export default Register;