import React, {useContext, useEffect, useReducer} from 'react'
import { View, Text,StyleSheet, Image } from 'react-native'
import {Appbar,Avatar, Card, Icon} from 'react-native-paper';
import { loginContext } from '../context/context';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';



const Perfil = ({navigation}) => {
  const {nameUser,logout, pickImagePerfil,image,getCurrentUser,loadProfileImageFromStorage} = useContext(loginContext)
  
  const handleLogout =  async () =>  { 
    try {
      await logout() 
      navigation.navigate("LoginScreen")
    } catch (error) {
      console.log(error, "No se puede desloguearse") 
    }
  }      

  useEffect(()=> {
    getCurrentUser()
    loadProfileImageFromStorage() 
  },[image])
  const AppheaderCustom = () => (
    <Appbar.Header style={[styles.containerHeader]}>
      <Appbar.Action icon="keyboard-backspace"  size={27}  color="#e6008c" onPress={() => {navigation.navigate("Home")}} />
      <View  style={[styles.containerTitle]}>
        <Text style={[styles.title]}>Mi</Text>
        <Text style={[styles.title]}>Perfil <Text>&#128515;</Text></Text>
      </View>
      <View style={[styles.containerPhotoPicture]}>
        <TouchableOpacity onPress={()=>{pickImagePerfil()}}>
          <Avatar.Icon size={44} color='white' backgroundColor="#EAEAEA" icon="camera-outline"/>
        </TouchableOpacity>
        <View style={[styles.pictureRounded]}>
        
          {image!== "undefined"  && <Avatar.Image size={170} source={{uri: 'https://elalfaylaomega.com/' + image}} />}
        </View>
        <TouchableOpacity  onPress={()=> {handleLogout()}} >
          <Avatar.Icon size={44} color='white' backgroundColor="#EAEAEA" icon="logout"/>
        </TouchableOpacity>
      </View>
      <View style={[styles.ContainerUserName]}>
        {/* <Text style={[styles.userName]}>{nameUser.charAt(0).toUpperCase() + nameUser.slice(1)}</Text> */}
      </View>
      <View style={[styles.containerSettingsProfile]}>
        <Card style={[styles.card]} elevation={1}>
          <Card.Content style={{display: "flex",alignItems: "center",justifyContent: "center", gap: 10,flexDirection: "row"}}>
            <Icon
              source="account"
              color="#e6008c"
              size={20}
            />
            <Text style={{textAlign: "center", fontSize: 18}} variant="titleLarge">Mi Cuenta</Text>
          </Card.Content>
        </Card>
      </View>
    </Appbar.Header>
  );

  return (
    <>
      <View style={[styles.container]}>
       <AppheaderCustom/>
      </View>
    </>
  )
}
const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  containerHeader: {
    backgroundColor: "white",
    marginVertical: 30,
    display:"flex",
    flexDirection: "col",
    alignItems: "flex-start",
  },
  containerTitle: {
    marginHorizontal: 10
  },
  title: {
    fontSize: 30,
    fontWeight: "400"
  },

  containerPhotoPicture: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  pictureRounded: {
    borderWidth: 8,
    borderColor: "#e6008c",
    padding: 10,
    borderRadius: 200,
  },
  ContainerUserName: {
    width: "100%"
  },
  userName: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600"
  },
  containerSettingsProfile: {
    width: "100%",
    height: 100,
    marginVertical:30
  },
  card: {
    marginHorizontal: 30,
    marginVertical:10,
    backgroundColor:"white"
  }
})

export default Perfil
