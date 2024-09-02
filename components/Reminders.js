import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { loginContext } from '../context/context';
import { FAB, Provider as PaperProvider, Portal, Modal, Icon, TextInput } from 'react-native-paper';
import { CalendarCustomDayShowcase } from './Calendar';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import 'moment/locale/es'; // Importar el locale en español
import { Button } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Reminders = () => {
  const {
    addReminders, date,
    setVisibleModalReminders, visibleModalReminders,
    getReminders, deleteReminders, nameUser, setTokensNotifications, tk, setDataToken, dataToken
  } = useContext(loginContext);
  
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dataReminders, setDataReminders] = useState([]);
  const [msg, setMsg] = useState("");
  const [updateTokens, setUpdateTokens] = useState(false);
  const [tokenFirebaseAuth0, setTokenFirebaseAuth0] = useState("");
  const [tokenDevice, setTokenDevice] = useState("")
  const [nid, setNid] = useState("")
  // Fetch token from the server
  const fetchToken = async () => {
    try {
      const response = await axios.get('http://54.218.224.215:8082/api/token');
      if (response.data && response.data.token) {
        const token = response.data.token;
        setTokenFirebaseAuth0(token);
        return token;
      } else {
        console.error('Token not found in response');
        return null;
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  // Send device token to Drupal
  const sendTokenDevices = async (tokenDevice) => {
    const token = await AsyncStorage.getItem("@TOKEN");
    const tokenDeviceDrupalNotify = await getTokenDevices();

    if (!tokenDeviceDrupalNotify.includes(tokenDevice)) {
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
        headers: {
          Accept: 'application/vnd.api+json',
          'Authorization': 'Basic YXBpOmFwaQ==',
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

      try {
        await axios.request(options);
        console.log('Token sent to Drupal successfully');
      } catch (error) {
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
          // http.ClientRequest en node.js
          console.log(error.request);
        } else {
          // Algo paso al preparar la petición que lanzo un Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    } else {
      console.log("Token ya existe en Drupal");
    }
  };

  // Get token devices from Drupal
  const getTokenDevices = async () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
      }
    };

    try {
      const response = await axios.request(options);
      const ids = response.data.data.map(token => token.attributes.field_token);
      return ids;
    } catch (error) {
      console.error('Error fetching tokens from Drupal:', error);
      return [];
    }
  };

  // Send FCM notification
  const sendFCMNotification = async (msg) => {
    const tokenDeviceDrupalNotify = await getTokenDevices();
    const tokenDevice = await AsyncStorage.getItem("TK-NOTY");
    console.log(tokenDevice, "tokendevice")
    const FCM_URL = 'https://fcm.googleapis.com/v1/projects/creditcustomers-9a40a/messages:send';
    const FCM_SERVER_KEY = tokenFirebaseAuth0;
    const filter = tokenDeviceDrupalNotify.filter((tk)=> tk !== tokenDevice )

    for (const token of filter) {
      try {
        const response = await axios.post(
          FCM_URL,
          {
            message: {
              token: token,
              notification: {
                title: "Abarrotes Juliancito 🏪",
                body: `📨 Recordatorio Nuevo: ${msg}`,
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

        console.log('Notification sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  };

  // Fetch reminders and update state
  const gettingCurrentReminders = async () => {
    try {
      const data = await getReminders();
      setDataReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // Handle add reminder
  const handleAddReminder = async () => {
    try {
      await addReminders(msg, date);
      const tokenDevice = await AsyncStorage.getItem("TK-NOTY");
      if (tokenDevice) {
        setTokenDevice(tokenDevice)
        await sendTokenDevices(tokenDevice);
      }
      await sendFCMNotification(msg,date);
      await gettingCurrentReminders();
      setMsg('');
      setVisibleModalReminders(false);
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  // Handle delete reminder
  const handleDeleteReminders = async (nid) => {
    try {
      await deleteReminders(nid);
      await gettingCurrentReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  useEffect(() => {
    fetchToken();
    getTokenDevices();
  }, [updateTokens]);

  useEffect(() => {
    gettingCurrentReminders();
  }, [nid, updateTokens]);

  // Render reminder item
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
        onPress={() => setVisibleModalReminders(true)}
        color="white"
      />
      <Portal>
        <Modal visible={dateModalVisible} onDismiss={() => setDateModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <CalendarCustomDayShowcase />
          <Button onPress={() => setDateModalVisible(false)} style={{ marginVertical: 40 }}>Cerrar</Button>
        </Modal>
      </Portal>
      <Portal>
        <Modal visible={visibleModalReminders} onDismiss={() => setVisibleModalReminders(false)} contentContainerStyle={styles.modalContainerDate}>
          <View style={styles.headerModal}>
            <Text style={styles.txtReminders}>Crear Recordatorio</Text>
            <View style={styles.bodyDate}>
              <TouchableWithoutFeedback onPress={() => setDateModalVisible(true)}>
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
