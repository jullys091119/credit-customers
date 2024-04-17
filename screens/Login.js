import React, { useEffect, useState, useContext } from 'react'
import tw from 'twrnc';
import {
View,
Text,
StyleSheet
} from 'react-native'
import axios from 'axios';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar} from 'react-native-paper';
import { loginContext } from '../context/context';
import { Icon } from 'react-native-paper';

const Login = ({navigation}) => {
  const [user, setUser] = useState("admin")
  const [pass, setPass] = useState("pass")
  const [tk, setTk]= useState("")
  

  const { login,logout } = useContext(loginContext);


  const handleLogin = async () => {
    let status = await login()
    if (status == 200) {
      navigation.navigate("HomeScreen")
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
    <>
    <View  style={[styles.container]}>
      <View style={[styles.bubleOne]}></View>
      <View style={[styles.bubleTwoo]}></View>
      <View style={[styles.bubleThree]}>
       <Text style={[styles.welcome]}>Welcome</Text>
       <Text style={[styles.back]}>Back</Text>
      </View>
      <View style={[styles.containerForm]}>
        <TextInput style={[styles.input, tw` bg-white pl-10`]} placeholder='User'  onChangeText={user => setUser(user)}
        value={user}/>
        <TextInput style={[styles.input, tw` bg-white pl-10`]} placeholder='Password' onChangeText={pass => setPass(pass)}
        value={pass}/>
      </View>
      <View style={[styles.containerSignin]}>
        <Text style={[styles.signin]}>Sign in</Text>
        <AvataLogin/>
      </View>

      <View>
        <TouchableOpacity onPress={()=>{openRegister()}} style={[styles.containerSignUp]}>
         <Icon source="account-plus-outline" color="#4E8CFE" size={26} />
         <Text style={[styles.signUp]}>Sing up</Text> 
        </TouchableOpacity>
      </View>
    </View>
    </>
  )
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#D7E5FF"
  },
  bubleOne: {
   backgroundColor: "#9BBEFD",
   height: 300,
   width: 300,
   borderBottomEndRadius: 240,
   position: "absolute",
   top:-100,
   left: -100,
   zIndex:22
  },
  bubleTwoo: {
    backgroundColor: "#9BBEFD",
    height: 400,
    width: 490,
    borderRadius: 300,
    position: "absolute",
    top: 0,
    right: -330,
    zIndex: -20
  },
  bubleThree: {
    backgroundColor: "#4E8CFE",
    height:360,
    width: 600,
    zIndex: 3,
    position: "absolute",
    top: 0,
    opacity: .90,
    borderBottomLeftRadius: 210,
    borderBottomEndRadius: 350
  },
  tabs: {
    height: 340,
    width: 300
  },
  welcome: {
    fontSize: 40,
    position: "absolute" ,
    top: 220,
    left: 140,
    color: "white"
  },
  back: {
    marginVertical: 30,
    fontSize: 57,
    position: "absolute",
    top: 230,
    left: 140,
    color: "white"
  },
  containerForm: {
   marginTop: 390
  },
  input: {
    width: 300,
    height:60,
    borderRadius: 16,
    marginVertical: 10
  },
  containerSignin: {
   width: 300,
   height: 120,
   paddingLeft: 10,
   marginHorizontal: 190,
   display: "flex",
   alignItems: "center",
   flexDirection: "row",
   justifyContent: "space-between"
  },
  containerSignUp: {
   direction: "flex",
   flexDirection: "row",
   justifyContent: "flex-start",
   alignItems: "center",
   width: 300
  },
  signin: {
    fontSize: 30,
    fontWeight: "600",
  },
  signUp: {
    fontSize: 18,
    alignSelf: "flex-start",
    fontWeight: "600",
    marginLeft: 4,
    color: "#4E8CFE"
  },
  iconGo: {
   backgroundColor: "#4E8CFE",
   marginLeft: 120
  }
})
export default Login


