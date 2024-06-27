import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { FAB, Provider as PaperProvider, Portal, Modal,Button,Icon,TextInput } from 'react-native-paper';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

const Reminders = () => {
  const [visible, setVisible] = useState(false);
	const [dateModalVisible, setDateModalVisible] = useState(false)
  const [msg, setMsg]= useState("")
	const [date, setDate] = useState(dayjs());


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

	const  showModalDate = () => setDateModalVisible(true)
	const hideModalDate = () => setDateModalVisible(false)


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Recordatorios</Text>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={showModal}
        />
				<Portal>
					<Modal visible={dateModalVisible} onDismiss={hideModalDate}  contentContainerStyle={styles.modalContainer}>
					<Button onPress={hideModal}>Cerrar</Button>
					</Modal>
				</Portal>
        <Portal>
          <Modal visible={visible} onDismiss={hideModalDate} contentContainerStyle={styles.modalContainer}>
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
									 style={{padding:10}}
									 onChangeText={(txt)=>setMsg(txt)}
									/>
									<View style={styles.bodyDate}>
										<TouchableWithoutFeedback onPress={showModalDate}>
											<Icon source="clock-in" color="#e6008c" size={37}/>
											<Text>Agregar fecha de recordatorio</Text>
										</TouchableWithoutFeedback>
									</View>
								 <Button icon="send-outline" mode="contained">
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
		display:"flex",
		flexDirection: "column",
		justifyContent: "flex-start",
    padding: 20,
    margin: 20,
    borderRadius: 10,
		height: 500
  },
	headerModal: {
		height:45,
		display:"flex",
		flexDirection: "row",
		justifyContent:"flex-start",
		alignItems: "center",
		gap: 10
	},
	txtReminders: {
		fontWeight: "600"
	},
	body: {
		flex:1,
		padding:10
	},
	formTxt: {
		fontWeight: "bold",
		marginVertical:10
	},
	bodyDate: {
		height: 60,
		paddingVertical:10,
		display:"flex",
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 20
	}
});

export default Reminders;
