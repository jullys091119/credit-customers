import React, { useState,useContext } from 'react'
import { Text, View, KeyboardAvoidingView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Button, TextInput, } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import BarcodeProductRegister from './BarcodeProductRegister';
import { loginContext } from '../context/context';

const ProductRegister = () => {
  const {
    setScanCodeProduct,
    scanCodeProduct,
    setNameProduct,
    setPriceProduct, 
    setBranName,
    setInventory,
    nameProduct,
    priceProduct,
    brandName,
    Inventory,
    setNewProductToDrupal
  
  } = useContext(loginContext)
  const [barcode, setBarcode] = useState(false)


  const handleProductRegister = async () => {
    await setNewProductToDrupal(scanCodeProduct,nameProduct,brandName,priceProduct,Inventory)
    setScanCodeProduct("")
    setNameProduct("")
    setPriceProduct("")
    setInventory("")
    setBranName("")
  }
 
  return (
    <KeyboardAvoidingView style={[styles.container]}>
      <View style={[styles.containerWelcome]}>
        <View>
          <Text style={{ fontSize: 20 }}>Register new product.</Text>
        </View>
      </View>
      <View>
        <BarcodeProductRegister />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 60}}
          >
          <TextInput
            mode='flat'
            label="Code"
            style={[styles.input]}
            keyboardType='numeric'
            value={scanCodeProduct}
          />
          <TextInput
            mode='flat'
            label="Name Product"
            value={nameProduct}
            style={[styles.input]}
            onChangeText={(txt)=> setNameProduct(txt)}
          />
          <TextInput
            mode='flat'
            label="Price Product"
            keyboardType='numeric'
            value={priceProduct}
            style={[styles.input]}
            onChangeText={(txt)=> setPriceProduct(txt)}
          />
          <TextInput
            mode='flat'
            label="Brand Name"
            style={[styles.input]}
            value={brandName}
            onChangeText={(txt)=> setBranName(txt)}
          />
          <TextInput
            mode='flat'
            label="Inventory Count"
            keyboardType='numeric'
            style={[styles.input]}
            value={Inventory}
            onChangeText={(txt)=> setInventory(txt)}
          />
          <TouchableOpacity style={{	backgroundColor: "#0093CE", 
            height: 40,
             marginVertical:30,
             display: "flex", 
             justifyContent: "center",
             alignItems: "center"}}
            onPress={() => handleProductRegister()}>
          <Text style={{color: "white"}}>Register Product</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  containerWelcome: {
    marginVertical:20
  },
  input: {
    width: 300,
    marginVertical: 10,
    backgroundColor: "none"
  },

})


export default ProductRegister