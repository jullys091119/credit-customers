import {React, useContext, useState} from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { loginContext } from '../context/context';
import Home from './Home';
import { Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper'; // Cambiado de PaperProvider a Provider
import {ListAccessoriesShowcase} from '../helpers/helpers';



const AlphabetScreen = ({navigation}) => {

  const [modalVisible, setModalVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  
  // Array con todas las letras del abecedario
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const  {getUsers, setUsers, users, showHome} = useContext(loginContext)

  const getCustomer = async (letter) => {
    const users = await getUsers(letter)
    setUsers(users)
    if(users.length !== 0) {
      setModalVisible(true); // Muestra el modal
      setDialogVisible(true)
    }
  }
  console.log(showHome, "showHome")
  const ModalCustomers = ({visible, onDismiss}) => { // Recibe una prop hideModal para cerrar el modal
    const containerStyle = { 
      backgroundColor: 'white',
      width:340, 
      height: 500,
      justifyContent: "center",
      marginHorizontal: 11,
      borderRadius: 300,
     };
    return (
      <Portal>
        <Modal visible={visible}  onDismiss={onDismiss} contentContainerStyle={containerStyle}>
          {/* {!showHome?<ListAccessoriesShowcase/>:<Home/>} */}
          <ListAccessoriesShowcase dialogVisible={dialogVisible}/>
        </Modal>
      </Portal>
    );
  };

  return (
    <>
      <FlatList
        data={alphabet}
        numColumns={3} // Número de columnas en el grid
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text} onPress={()=> {getCustomer(item)}}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Key extractor necesario para FlatList
      />
     
        {/* ModalCustomers se renderiza si modalVisible es true */}
        <ModalCustomers visible={modalVisible} onDismiss={() => setModalVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 50,
    backgroundColor: '#DDDDDD',
    marginTop: 30,

  },
  text: {
    fontSize: 24,
  },
});

export default AlphabetScreen;
