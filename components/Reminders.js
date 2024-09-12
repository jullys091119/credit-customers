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
    getReminders, deleteReminders, nameUser,sendTokenDevices,sendFCMNotification,
  } = useContext(loginContext);
  
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dataReminders, setDataReminders] = useState([]);
  const [msg, setMsg] = useState("");
  const [updateTokens, setUpdateTokens] = useState(false);
  const [tokenDevice, setTokenDevice] = useState("")
  const [nid, setNid] = useState("")


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
  const handleDeleteReminders = async (nid,msg) => {
    const msgReminders = `El recordatorio "${msg}" ha sido eliminado exitosamente.`;

    try {
      await deleteReminders(nid);
      await gettingCurrentReminders();
      await sendFCMNotification(msgReminders)
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  useEffect(() => {
  
    
  }, [updateTokens]);

  useEffect(() => {
    gettingCurrentReminders();
  }, [nid, updateTokens]);

  // Render reminder item
  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminders(item.nid, item.msg)}>
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
