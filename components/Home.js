import React, { useEffect, useReducer, useState, useRef } from 'react'
import { useContext } from 'react';
import { loginContext } from '../context/context';
import { View, StyleSheet, Text, Image } from 'react-native'
import { Appbar, Avatar, Card,ActivityIndicator } from 'react-native-paper';
import axios from 'axios'
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español
moment.locale('es');


const Home = ({navigation}) => {

  const {getSalesNoteBookHome,nameUser, mounted, smallPerfil, loadProfileImageFromStorage} = useContext(loginContext)
  const [data, setData] = useState()
  const [total, setTotal] = useState()
  const  [showSales, setShowSales] = useState(false)
  useEffect(() => { 
    const fetchData = async () => {
      try {
        const data = await getSalesNoteBookHome();
        setData(data)
        const salesTotal = data.reduce((total, item) => parseInt(total) + parseInt(item.total), 0);
        setTotal(salesTotal);
        setShowSales(true); // Establecer el estado para mostrar SalesNoteBook
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowSales(false); // Establecer el estado para ocultar SalesNoteBook en caso de error
      }
    }; 
    fetchData();   
  }, [mounted]);
 

  useEffect(()=> {
    loadProfileImageFromStorage()
  },[showSales, smallPerfil])

 
  const AvatarIconPicture = ({ picture }) => (
    <>
      <Avatar.Image 
        size={44} 
        source={{ uri: 'https://elalfaylaomega.com/' + picture }}
      />
    </>
  );

  const AppheaderCustom = () => (
    <Appbar.Header style={[styles.containerHeader]}>
       <View style={[styles.containerBuy]}> 
        <Image source={require('../assets/bolsa.png')} style={{width: 30, height: 30, marginTop: 0, marginLeft: 1}} />
        <Text style={{fontSize: 30, fontWeight: "500"}}>Mis Compras</Text>
      </View>
      <View  style={[styles.containerPicture]}>
        <AvatarIconPicture picture={smallPerfil} />
         <Text style={{fontSize: 19, fontWeight:"600"}}>{nameUser !== null && nameUser.charAt(0).toUpperCase() + nameUser.slice(1)}</Text>
      </View>
    </Appbar.Header>
  );
  
  const CartSalesCustomers = () => (
    <View style={[styles.containerCart]}>
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
    {<ActivityIndicator animating={!showSales} color="#e6008c" size={30} style={{marginVertical: !showSales? 30: null }}/> }
    {showSales && <SalesNoteBook/>} 
   </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "white"
  },
  containerHeader: {
    marginVertical: 30,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  containerCart: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
  },
  containerSales: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    gap:10,
  },
  containerPicture: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
})

export default Home
