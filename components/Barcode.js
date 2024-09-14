import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { FAB, Provider as PaperProvider,Drawer } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { loginContext } from "../context/context";

export default function Barcode() {
  const  {
    setScannedSale,
    scannedSale,
    setScannedSaleCode,
    setSalesToDrupal,
    dataDrupalSales,
    setDataDrupalSales
  }  = useContext(loginContext)
  const [hasPermission, setHasPermission] = useState(null);

   
 

  const isFocused = useIsFocused();
  // console.log(isFocused, "ISFOCUSED")
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScannedSale(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setScannedSaleCode(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
   
  return (
    <View style={styles.container}>
      <View style={{height:300, flexDirection: "column-reverse"}}>
       
        <CameraView
          onBarcodeScanned={scannedSale ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "upc_a"]
            
          }}
          
          style={StyleSheet.absoluteFillObject}
          
          />
          {/* {scannedSale && (
         <TouchableOpacity style={{ display: "flex", justifyContent: "center", alignItems: "center", height:20,backgroundColor: "#0093CE"}}>
           <Text style={{color: "white"}}>Presiona el icono de Barcode</Text>
         </TouchableOpacity>
      )} */}

      </View>
       {/* {
        scannedSale && (
          <FAB
          icon="barcode-scan"
          style={styles.fab}
          onPress={() => setScannedSale(false)}
            color="white"
            />
        )
       } */}
    
    </View>
  );
}

const styles = StyleSheet.create({
  
  fab: {
    width: 70,
    height: 70,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 400,
    position: "absolute",
    bottom: -360,
    right: 10,
    zIndex: 100,
   backgroundColor: "#0093CE"
  }
});