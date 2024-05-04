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
import {ActivityIndicator} from 'react-native-paper';

const Login = ({navigation}) => {
  const { login,logout,setUser,setPass, user,pass } = useContext(loginContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLogin = async () => {
    if(user != "" && pass != "") setIsLoaded(true)
    let status = await login()
    // console.log(status, "status")
    if (status == 200) {
      setIsLoaded(false)
      navigation.navigate("HomeScreen")
      setUser("")
      setPass("")
    } 
  };

  const openRegister = async () => {
    try {
      navigation.navigate("Register")
    } catch (error) {
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
          <Text style={{fontSize: 40, fontWeight: "600"}}>Hello,</Text>
          <Text style={{fontSize: 20}}>Please Login to</Text>
          <Text style={{fontSize: 20}}>Your Account!</Text>
        </View>
      </View>
      <View>
        <TextInput
          mode='flat'
          label="User name"
          onChangeText={txt => setUser(txt)}
          value={user}
          style={[styles.input]}
        />
        <TextInput
          mode='flat'
          secureTextEntry={showPassword?true:false}
          label="password"
          value={pass}
          onChangeText={txt => setPass(txt)}
          right={<TextInput.Icon icon={!showPassword?"eye":"eye-off-outline"} placeholder='Password' onPress={() => {setShowPassword(!showPassword)}} />}
          style={[styles.input]}
        />
        <TouchableOpacity style={{height: 50, backgroundColor: "#2196F3", padding: 10, marginVertical: 30}} onPress={handleLogin}>
          <ActivityIndicator color="white" animating={isLoaded} style={styles.activityIndicator} />
          <Text style={[styles.loginText]}>{isLoaded?null:"LOGIN"}</Text>
        </TouchableOpacity>
        <View style={[styles.containerSingUp]}>
          <Text>Don't have accout?</Text><TouchableOpacity><Text style={[styles.singup]} onPress={openRegister}>Sing up</Text></TouchableOpacity>
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
    gap: 10,
  },
  activityIndicator: {
    position: "absolute",
    left: "50%",
    top: 10
  }

})
export default Login


