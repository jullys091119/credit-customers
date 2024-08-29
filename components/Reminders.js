import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, Keyboard, KeyboardEvent, KeyboardEventListener } from 'react-native';
import { loginContext } from '../context/context';
import { FAB, Provider as PaperProvider, Portal, Modal, Icon, TextInput } from 'react-native-paper';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CalendarCustomDayShowcase } from './Calendar';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import 'moment/locale/es'; // Importar el locale en español
import { Button } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import axios from 'axios';


const Reminders = () => {
  const { addReminders, date,
    setVisibleModalReminders, visibleModalReminders,
    getReminders, deleteReminders, nameUser, setTokensNotifications, tk, setDataToken, dataToken } = useContext(loginContext);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dataReminders, setDataReminders] = useState([]);
  const [msg, setMsg] = useState("")
  const showModal = () => setVisibleModalReminders(true);
  const hideModal = () => setVisibleModalReminders(false);
  const showModalDate = () => setDateModalVisible(true);
  const hideModalDate = () => setDateModalVisible(false);
  const [tokens, setTokens] = useState([]);
  const [tkLoaded, setTkLoaded] = useState(false)
  const [nid, setNid] = useState("")
  const [updateTokens, setUpdateTokens] = useState(false);
  const [tokenFirebaseAuth0, setTokenFirebaseAuth0] = useState("")
  const [tokenDevice, setTokenDevice] = useState("")
  const [tokenDeviceDrupal, setTokenDeviceDrupal] = useState([])
  

  const gettingCurrentReminders = async () => {
    try {
      const data = await getReminders();
      // console.log('Fetched reminders:', data);
      setDataReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

 
async function fetchToken() {

  //actualizando token del celular
  const tkDevice = await AsyncStorage.getItem("TK-NOTY")
  setTokenDevice(tkDevice)
  try {
    // Hacer la solicitud GET para obtener el token
    const response = await axios.get('http://54.218.224.215:8082/api/token');
    
    // Verificar si la respuesta contiene el token
    if (response.data && response.data.token) {
      const token = response.data.token;
      // console.log('Token fetched successfully:', token);
      //actualizando el token  auth0
      setTokenFirebaseAuth0(token)
      return token;
    } else {
      console.error('Token not found in response');
      return null;
    }
  } catch (error) {
    // Manejo de errores
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado fuera del rango de 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('Error request:', error.request);
    } else {
      // Algo pasó al preparar la solicitud que lanzó un error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    return null;
  } 
}
  

//Enviamos los tokens a Drupal 
const sendTokenDevices = async () => {
    const token = await AsyncStorage.getItem("@TOKEN")
    setUpdateTokens(true)
    if(tokenDeviceDrupal.includes(tokenDevice)) {
      console.log("token ya existe")
      return;
    } else {
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: 'Authorization: Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': token,
        },
        data: {
          data: {
            type: 'node--notification-push',
            attributes: {
              title: 'tokens guardados',
              field_token: tokenDevice,
            },
          },
        },
      };
      
      const response = await axios.request(options);
      if (response) {
        // console.log(response);
      }

    }
  }
  
  useEffect(() => {
    fetchToken() 
    getTokenDevices()
  }, [tokenDevice, updateTokens]);



  //Obtenemos los tokens de drupal
  const getTokenDevices = async() => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
      headers: { 
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
      }
    };

    const response = await axios.request(options);
    if (response) {
      const id  = response.data.data.map(token => token.attributes.field_token);
      console.log(id)
      setTokenDeviceDrupal(id)
    }

  }

 

  const sendFCMNotification = async () => {
    await sendTokenDevices(); // Asume que esta función se encarga de preparar el entorno
  
    const FCM_URL = 'https://fcm.googleapis.com/v1/projects/creditcustomers-9a40a/messages:send';
    const FCM_SERVER_KEY = tokenFirebaseAuth0; // Asegúrate de que este token sea válido
    const tokenDeviceDrupalNotify = tokenDeviceDrupal
    const currentDeviceToken =  tokenDevice
    
    const filtered  = tokenDeviceDrupalNotify.filter(token => token !== currentDeviceToken && token !== null)
    
    for (const token of filtered) {
      try {
        const response = await axios.post(
          FCM_URL,
          {
            message: {
              token: token,
              notification: {
                title: "Hello",
                body: "World",
              },
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${FCM_SERVER_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        // Registra la respuesta de la notificación
        console.log('Notification sent successfully:', response.data);
      } catch (error) {
        // Manejo de errores
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado fuera del rango de 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error('Error request:', error.request);
        } else {
          // Algo pasó al preparar la solicitud que lanzó un error
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    }
  };
  


  
  
  useEffect(()=> {
    fetchToken()
    // getTokenDevices()
  },[])

  useEffect(() => {
    gettingCurrentReminders();
  }, [nid, tkLoaded, tokens]);

  const handleAddReminder = async () => {
    try {
      await addReminders(msg, date);
      await gettingCurrentReminders(); // Refresca la lista después de agregar
      setMsg('');
      hideModal();
      sendFCMNotification()

    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };


  const handleDeleteReminders = async (nid) => {
    setNid(nid)
    await deleteReminders(nid)
  }

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminders(item.nid)}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.itemContainer}>
        <View style={styles.indexPosition}>
          <Text style={{ color: "white" }}>{index + 1}</Text>
        </View>
        <Text style={styles.itemText}>
          {item.msg || "No Message"}
        </Text>
        <Text>Por : {nameUser}</Text>
        <Text style={styles.itemDate}>
          {item.date ? moment(item.date).format('dddd DD [de] MMMM') : "No Date"}
          {/* Formato: sábado 23 de abril */}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <PaperProvider>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Recordatorios</Text>
      </View>
      <FlatList
        data={dataReminders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showModal}
        color="white"
      />
      <Portal>
        <Modal visible={dateModalVisible} onDismiss={hideModalDate} contentContainerStyle={styles.modalContainer}>
          <CalendarCustomDayShowcase />
          <Button onPress={hideModalDate} style={{ marginVertical: 40 }}>Cerrar</Button>
        </Modal>
      </Portal>
      <Portal>
        <Modal visible={visibleModalReminders} onDismiss={hideModal} contentContainerStyle={styles.modalContainerDate}>
          <View style={styles.headerModal}>
            <Text style={styles.txtReminders}>Crear Recordatorio</Text>
            <View style={styles.bodyDate}>
              <TouchableWithoutFeedback onPress={showModalDate}>
                <Icon source="calendar" color="#0093CE" size={37} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.form}>
              <Text style={styles.formTxt}>Recordatorio</Text>
              <TextInput
                mode="outlined"
                multiline={true}
                value={msg}
                style={{ padding: 10, height: 180 }}
                onChangeText={(txt) => setMsg(txt)}
              />

              <Button onPress={handleAddReminder} style={{ backgroundColor: "#0093CE", borderWidth: 0, marginVertical: 15 }}>Crear</Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },

  fab: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 30,
    right: 20,
    padding: 3,
    backgroundColor: '#0093CE',
  },

  header: {
    padding: 20,
  },

  headerTxt: {
    fontSize: 20,
    fontWeight: '500',
  },

  modalContainer: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: 500,
  },
  modalContainerDate: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: 400,
    width: 300,
    margin: "auto"
  },

  headerModal: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  txtReminders: {
    fontWeight: '600',
    marginLeft: 9
  },

  body: {
    flex: 1,
    padding: 10,
  },

  formTxt: {
    fontWeight: 'bold',
    marginVertical: 10,
  },

  bodyDate: {
    height: 60,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  listContainer: {
    padding: 10,
  },

  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    elevation: 1,
    marginVertical: 10
  },

  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: "400"
  },

  itemDate: {
    fontSize: 14,
    color: '#0093CE',
    fontWeight: "500",
    marginVertical: 10,

  },

  deleteButton: {
    backgroundColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderRadius: 5,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  indexPosition: {
    backgroundColor: "#0093CE",
    width: 30,
    height: 30,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    top: -10

  }
});

export default Reminders;
