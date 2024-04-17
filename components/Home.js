import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { loginContext } from '../context/context';
import { View, StyleSheet, Text, Image } from 'react-native'
import { Appbar, Avatar, Card } from 'react-native-paper';
import axios from 'axios'
import { getSalesNoteBook } from '../Fetch';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español
moment.locale('es');


const Home = ({navigation}) => {

  const [data, setData] = useState()
  const [total, setTotal] = useState()

  const {logout,checkLoginStatus } = useContext(loginContext)

  const handleLogout = () =>  {
    try {
      logout()
      navigation.navigate("LoginScreen")
    } catch (error) {
      console.log(error, "No se puede desloguearse")
    }
  }
  
  const getFetchData = async () => {
    try {
      const data = await getSalesNoteBook();
      setData(data)
      const salesTotal = data.reduce((total, item) => parseInt(total) + parseInt(item.total), 0);
      setTotal(salesTotal)
    } catch (error) {
      console.error("Error al obtener los datos del Sales Notebook:", error);
    }
  };
  
  useEffect(( ) => {
    getFetchData()
    checkLoginStatus()
  },[])
  
  const AvatarIconPicture = () => (
    <Avatar.Image 
      size={44} 
      source={require('../assets/julian.jpg')}
    />
  );

  const AppheaderCustom = () => (
    <Appbar.Header style={[styles.containerHeader]}>
      <Appbar.Action icon="keyboard-backspace"  size={27}  color="#e6008c" onPress={() => {handleLogout()}} />
      <AvatarIconPicture/>
    </Appbar.Header>
  );
  
  const CartSalesCustomers = () => (
    <View style={[styles.containerCart]}>
      <View>
        <Text style={{fontSize: 30, fontWeight: "500"}}>My</Text>
        <Text style={{fontSize: 30, fontWeight: "500"}}>Cart</Text>
      </View>
      <>
        <Image source={require('../assets/bolsa.png')} style={{width: 50, height: 50, marginTop: 29, marginLeft: 15}} />
      </>
      <View style={[styles.containerTotal]}>
        <Text style={{fontSize: 20, fontWeight: "600"}}>Total:</Text>
        <Image style={{width: 40, height: 40,}}  source={require('../assets/images/monedas.png')}/>
        <Text style={{fontSize:20, fontWeight: "600"}}>${total}</Text>
      </View>
    </View>
  )
  const SalesNoteBook = () => {
    return(
      <FlatList
       data={data}
        renderItem={({item,index}) => (
          <View style={[styles.containerSales]} key={index}>
            <Card style={[styles.card]}>
              <View>
                <Image style={{width: 58, height: 58}}  source={require('../assets/images/ventas.png')}/>
              </View>
            </Card>
            <Card style={[styles.cardDate]} elevation={1}>
              <View style={{display: "flex"}}>
               <Image style={{width: 28, height: 28, marginTop: -6, alignSelf: "flex-end"}}  source={require('../assets/images/calendario.png')}/>
               <Text style={[styles.date]}>{moment(item.date).format("ll")}</Text>
              </View>
            </Card>
            <Card style={[styles.cardSales]}>
              <View>
                <Text style={{marginTop: 7, fontWeight: "600"}}>
                <Image style={{width: 28, height: 28, marginTop: -6, alignSelf: "flex-end"}}  source={require('../assets/images/dolar.png')}/>{item.total}</Text>
              </View>
            </Card>
          </View>
        )}
    />
    )
  }
  return (
   <View style={[styles.container]}>
    <AppheaderCustom/>
    <CartSalesCustomers/>
    <SalesNoteBook/>
   </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerHeader: {
    marginVertical: 30,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  containerCart: {
    paddingHorizontal: 30,
    marginTop: -30,
    display: "flex",
    flexDirection: "row",
  },
  containerSales: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginHorizontal: 20,
    marginVertical: 20
  }, 
  card: {
    width: 70,
    height: 70,
    marginVertical: 0,
    padding: 4
  },
  cardSales: {
    width: 70,
    height: 70,
  },
  cardDate: {
    width: 150,
    height: 70,
    padding: 10
  },
  date: {
    textAlign: "center",
    marginTop: 9,
    fontWeight: "600"
  },
  total: {
    width: 360,
    height: 60,
    alignSelf: "center"
  },
  containerTotal: {
    display: "flex",
    flexDirection: "row",
    width: "63%",
    alignItems: "flex-end",
    paddingLeft: 16,
    gap:10,
  }
})

export default Home
