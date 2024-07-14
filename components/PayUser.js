import React, { useContext, useState } from "react"
import { View, Text, StyleSheet, TextInput } from "react-native"
import { loginContext } from "../context/context"
import { Button } from "@ui-kitten/components"
import axios from "axios"


const PayUser = () => {
  const { userName, total,payCountUser, pay, setPay} = useContext(loginContext)
  return (
    <View style={styles.container}>
      <Text style={styles.containerTxt}>¿ Liquidar adeudo de:  {userName.toUpperCase()} ?</Text>
      <Text>Total credito: {total}</Text>
      <TextInput
        placeholder="$"
        mode="flat"
        value={pay}
        onChangeText={(number) => setPay(number)}
        keyboardType="numeric"
        style={[styles.inputvalue]}
      />
      <Button style={{
        width: 200,
        marginVertical: 20,
        backgroundColor: "#0093CE",
        borderWidth: 0
      }} onPress={() => { payCountUser() }}>
        Pagar crédito
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  containerTxt: {
    fontSize: 20,
    fontWeight: "500"
  },
  inputvalue: {
    height: 45,
    width: 280,
    borderRadius: 7,
    backgroundColor: "white",
    marginTop: 15,
    paddingHorizontal: 10,
    color: "#464555",

  },
})

export default PayUser