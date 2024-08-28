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
  const [userIds, setUserIds] = useState([]);
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
  const tkDevice = await AsyncStorage.getItem("TK-NOTY")
  setTokenDevice(tkDevice)
  try {
    // Hacer la solicitud GET para obtener el token
    const response = await axios.get('http://54.218.224.215:8082/api/token');
    
    // Verificar si la respuesta contiene el token
    if (response.data && response.data.token) {
      const token = response.data.token;
      // console.log('Token fetched successfully:', token);
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
const sendTokenDevices = async (tokenDevice) => {
    getTokenDevices()
    const token = await AsyncStorage.getItem("@TOKEN")
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
  
  useEffect(() => {
    fetchToken() 
  
  }, [tokenDevice]);


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
      setTokenDeviceDrupal(id)
    }

  }


  
  const sendFCMNotification = async () => {
    const FCM_URL = 'https://fcm.googleapis.com/v1/projects/creditcustomers-9a40a/messages:send';
    const FCM_SERVER_KEY = 'ya29.c.c0ASRK0GZWq6_4kFQq-iOs9Q2LIePkqd2vwqp2uIHYdxO5t2wf9kBcKjD3EB9BsouBu3E1TievHTL9qCgVPbDBKDrY-QQGicuu0muTx9ljTj9ntsm_MEXBjIJSOlFt95FIWYFIBM49kyz-KKSKxama8p2SQJcC5ZvwWWcRVMVsjnt-D_E9aonRvwdDHE_BOsC3hiWdOvcHMZy4JnJvLaOPwTuuxj2ICiccFdBSSgcAjNuTnRdmv2c77W804SFylPvmlGv7Vfd3kluUVQ7KvmOYS5vFOHJFRZFqBJdDh_789GDuUsEcI18F3RAnXNjFdHAPfdDVq5Yb8QwWIX6BOesnetR1d8RQAB0sIYV6ymhDMSHj0vlU6Aivr2BaG385Asgpy1ygFnUo97p8ctus-erdeiBqUl2g0lboiBXe9vnSl_ruwwi6QYJyi0Btxxr462I6_xgBmhBQZMlti7hm4_gvMi6cep1jmqBeXBy0O5f8_at1zk_vkqgWUVofVyhxhah-BvlQ13drvSwbV0RxjkajaOeQ3cwZUy9t-0u8OMwp7xiMlR6UfBMt5oaF2hJfxutBxBg7IgqBOO26Rc4aVMzif0iWYsI-9IdZ_m8FiFrcRZj_arafImgFwcc4ph6iOxVBjjlUBiMyJ_nI7Ot-fXjBUoF1zglgS74zWr1j_8_3cu31JnB4c1osqi5J3Y_yyjzRd7dhJ0uQYzutlSJBkfceMQbuS5kRWkbYlqlbeQ0sYwYnMfYYQkcU6xxh8Ykg4hw4mac1abcyetMthM0pYp41Z3O2ZX7boobo2SsrvZ7l2Vm12XFf2Bcxq0kaXmvMtXepb5V8F6p1MRtl8niUMb5FU_naiuYRxrp1d-ss3SxjMdR494hhxgdzQmZe62QrBo1X84uQcB88nO0wOQ10FRZtrcbeU6srcOenI_zO_Ys86Rgzr8fqmwv6jjFSVoZehv5y2WzsOk6gWO62JdsdjXaYJFyMU3s_xI0IJBsv8VgZOizyni3uf9Ucv3q'; // Tu Server Key
    const token = 'eRMEeU8-TTuX8Jmo9CL7cW:APA91bELtRw9ec3upHAyL9YQH7yx1X0nsHY9bdA4DSOyS_PTcHCJnVwaVtpjuJv4a5tl5ce0in2Pdu3rMyCMZQMQ2Ri1vd0T2AJ5FBCqbcd7dlabZ122h--XoBhs1tEcwrCNvEFcoIQQ'; // El token del dispositivo

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

      console.log('Notification sent successfully:', response.data);
      sendTokenDevices(token)
      return response.data;
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
  };
  
  useEffect(()=> {
    fetchToken()
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
