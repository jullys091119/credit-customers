import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, FlatList,ScrollView } from "react-native";
import { loginContext } from "../context/context";
import { FAB, Provider as PaperProvider, Portal, Modal, Button, Icon, TextInput } from 'react-native-paper';
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { CalendarCustomDayShowcase } from "./Calendar";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from "moment";
const Reminders = () => {
  const { addReminders, date, msg, setMsg, setVisibleModalReminders, visibleModalReminders, getReminders } = useContext(loginContext)
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [dataReminders, setDataReminders] = useState([]);



  const showModal = () => setVisibleModalReminders(true);
  const hideModal = () => setVisibleModalReminders(false);

  const showModalDate = () => setDateModalVisible(true)
  const hideModalDate = () => setDateModalVisible(false)

  const gettingCurrentReminders = async () => {
    try {
      const data = await getReminders();
      setDataReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const renderItem = ({ item, index }) => (


    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(index)}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.itemContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.itemText}>
          {item.msg}{"      "}
          {moment(item.date).format("ll")}
        </Text>

      </ScrollView>

      </View>
    </Swipeable>
  );

  useEffect(() => {
    gettingCurrentReminders();
  }, []);


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Recordatorios</Text>
        </View>
      
        <FlatList
          data={dataReminders}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
  
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
            <Button onPress={hideModal}>Cerrar</Button>
          </Modal>
        </Portal>


        <Portal>
          <Modal visible={visibleModalReminders} onDismiss={hideModalDate} contentContainerStyle={styles.modalContainer}>
            <View style={styles.headerModal}>
              <Icon source="clock-outline" color="#e6008c" size={37} />
              <Text style={styles.txtReminders}>Crear Recordatorio</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.form}>
                <Text style={styles.formTxt}>Recordatorio</Text>
                <TextInput mode="outlined"
                  multiline={true}
                  value={msg}
                  style={{ padding: 10 }}
                  onChangeText={(txt) => setMsg(txt)}
                />
                <View style={styles.bodyDate}>
                  <TouchableWithoutFeedback onPress={showModalDate}>
                    <Icon source="clock-in" color="#e6008c" size={37} />
                    <Text>Agregar fecha de recordatorio</Text>
                  </TouchableWithoutFeedback>
                </View>
                <Button icon="send-outline" mode="contained" onPress={() => { addReminders(msg, date) }}>
                  Crear Recordatorio
                </Button>
              </View>
            </View>
            <Button onPress={hideModal}>Cerrar</Button>
          </Modal>
        </Portal>
      </View>
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
    position: "absolute",
    bottom: 30,
    right: 20,
    padding: 3,
    backgroundColor: "#0093CE"
  },
  header: {
    padding: 20,
  },
  headerTxt: {
    fontSize: 20,
    fontWeight: "500",
  },
  modalContainer: {
    backgroundColor: 'white',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: 500
  },
  headerModal: {
    height: 45,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10
  },
  txtReminders: {
    fontWeight: "600"
  },
  body: {
    flex: 1,
    padding: 10
  },
  formTxt: {
    fontWeight: "bold",
    marginVertical: 10
  },
  bodyDate: {
    height: 60,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
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
  },
  itemText: {
    fontSize: 16,
    color: '#333',
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
});

export default Reminders;
