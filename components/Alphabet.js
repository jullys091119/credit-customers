import {React, useContext, useState, useRef, useEffect} from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { loginContext } from '../context/context';
import { Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper'; // Cambiado de PaperProvider a Provider
import {ListAccessoriesShowcase} from '../helpers/helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

const AlphabetScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [indicator, setIndicator] = useState(false)
  const [indexAlphabet, setIndexAlphabeth] = useState("")
  const [selectedLetter, setSelectedLetter] = useState("");
  // Array con todas las letras del abecedario
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const  {getUsers, setUsers} = useContext(loginContext)

  const getCustomer = async (letter) => {
    setSelectedLetter(letter);
    setIndicator(true);
    const users = await getUsers(letter)
    const filterdUsers = users.filter((user) => user.id !== 1 && user.name !== "admin");
    setUsers(filterdUsers)
    if(users.length !== 0) {
      setModalVisible(true); // Muestra el modal
      setIndicator(false);
    }
  }
  
  const ModalCustomers = ({visible, onDismiss}) => { // Recibe una prop hideModal para cerrar el modal
    const containerStyle = {       
      width:340, 
      height: 500,
      justifyContent: "center",
      marginHorizontal: 11,
      borderRadius: 300,
     };
    return (
      <Portal>
        <Modal visible={visible}  onDismiss={onDismiss} contentContainerStyle={containerStyle}>
          <ListAccessoriesShowcase  />
        </Modal>
      </Portal>
    );
  };
 
  return (
    <>
      <FlatList
        data={alphabet}
        numColumns={3} // Número de columnas en el grid
        renderItem={({ item,index }) => (
          <View style={{flex:1, backgroundColor: "white"}}>
            <TouchableOpacity  onPress={()=> {getCustomer(item, index)}}>
              <View style={styles.item}>
                <Text>{indexAlphabet}</Text>
                <Text style={styles.text}>{item}</Text>
                 {selectedLetter === item && <ActivityIndicator animating={indicator} color="white" />}
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Key extractor necesario para FlatList
      />
        {/* ModalCustomers se renderiza si modalVisible es true */}
        <ModalCustomers visible={modalVisible} onDismiss={() => setModalVisible(false)}/>
    </>
  );
};



const styles = StyleSheet.create({
  item: {
    textAlign: "center",
    backgroundColor: '#e6008c',
    borderRadius: 10,
    margin: 2,
    borderWidth: 3,
    borderColor: "#FFDB58",
    height: 100,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center"
    
  },
});

export default AlphabetScreen;
