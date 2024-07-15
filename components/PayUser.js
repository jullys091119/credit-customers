import React, {useContext, useEffect, useState} from "react";
import { loginContext } from "../context/context";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, PaperProvider } from 'react-native-paper';
import { Input,Button } from "@ui-kitten/components";
import ConfettiCannon from 'react-native-confetti-cannon'



const PayUser = ({ modal, setModal,total,payCountUser,setPay,pay,setConfetti,confetti}) => {
  const {userName} = useContext(loginContext)
  const [visible, setIsVisible] = useState(false)
  const hideModal = () => setModal(false);
  const containerStyle = { backgroundColor: 'white',
   padding: 20,
   width: 300,
   height: 500,
   margin: "auto",
   display: "flex",
   justifyContent: "center",
   gap:20
 };

 const Confetti = () => (
  <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
);
 
 useEffect(()=> {
   if(!modal) {
    setConfetti(false)
   }
  
 },[modal])
 
 
  return (
    <PaperProvider>
      <Portal>
        <Modal visible={modal} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          {confetti && <Confetti/>}
          <Text style={styles.txt}>Desea pagar la cuenta de: {userName.toUpperCase()}? </Text>
          <Input
            placeholder='Pagar cuenta'
            value={pay}
            onChangeText={nextValue => setPay(nextValue)}
            keyboardType="numeric"
          />
          <Text style={styles.txt}>Total:{total}</Text>
          <Text style={styles.txt}>Cambio:{Math.sign(pay - total) - 1?0 &&pay > total: pay - total}</Text>
          <Button  onPress={()=> {payCountUser(pay)}} style={{backgroundColor:"#0093CE", borderWidth:0}}>Pagar</Button>

          {/* <Button onPress={hideModal}>Cerrar</Button> */}
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
 txt: {
  fontSize:17,
  fontWeight: "700"
 }
})

export default PayUser;
