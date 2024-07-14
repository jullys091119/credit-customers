import { React, useContext, useState, useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { loginContext } from '../context/context';
import { Modal, Portal, Button, Provider as PaperProvider } from 'react-native-paper'; // Cambiado de PaperProvider a Provider
import { ListAccessoriesShowcase } from '../helpers/helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

const AlphabetScreen = ({ navigation }) => {
  const [indicator, setIndicator] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState("");

  // Array con todas las letras del abecedario
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const {
    getUsers,
    setUsers,
    alertErrorsSales,
    setModalVisible,
    modalVisible,
    payCountUser
  } = useContext(loginContext)

  const getCustomer = async (letter) => {
    setSelectedLetter(letter);
    setIndicator(true);
    const users = await getUsers(letter)
    const filterdUsers = users.filter((user) => user.id !== 1 && user.name !== "admin");
    setUsers(filterdUsers)
    if (users.length !== 0) {
      setModalVisible(true); // Muestra el modal
      setIndicator(false);
      console.log(indicator, "indicator")
    } else {
      alertErrorsSales("No hay clientes registrados para esta letra")
      setIndicator(false)
    }
  }
 //Modal numero uno
  const ModalCustomers = ({ visible, onDismiss }) => { // Recibe una prop hideModal para cerrar el modal
    const containerStyle = {
      width: 340,
      maxHeight: 425,
      margin: "auto",
      justifyContent: "center",
      flex: 1,
      marginHorizontal: 10
    };
    return (
      <Portal>
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={containerStyle}>
          <ListAccessoriesShowcase navigation={navigation} />
        </Modal>
      </Portal>
    );
  };

  return (
    <>
      <View style={{marginTop:30, marginHorizontal: 10}} >
        <FlatList
          data={alphabet}
          numColumns={3} // Número de columnas en el grid
          renderItem={({ item, index }) => (
              <View style={{ flex: 1, backgroundColor: "#F0EDFF", gap: 10}}>
                <TouchableOpacity onPress={() => { getCustomer(item, index) }}>
                  <View style={styles.item}>
                    {selectedLetter === item && indicator ? <ActivityIndicator animating={indicator} color="white" /> : <Text style={styles.text}>{item}</Text>}
                  </View>
                </TouchableOpacity>
              </View>
          )}
          keyExtractor={(item, index) => index.toString()} // Key extractor necesario para FlatList
        />
        {/* ModalCustomers se renderiza si modalVisible es true */}
        <ModalCustomers visible={modalVisible} onDismiss={() => setModalVisible(false)} />
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    textAlign: "center",
    backgroundColor: '#0093CE',
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    borderColor: "#e6008c",
    height: 90,
    marginHorizontal: 5,
    marginVertical: 5
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    textAlign: "center"
  },
});

export default AlphabetScreen;
