import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { FAB, Provider as PaperProvider,Drawer } from 'react-native-paper';


export default function Barcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
      


  return (
    <View style={styles.container}>
      <View style={{height:380, flexDirection: "column-reverse"}}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "upc_a"]
          }}
          style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
         <TouchableOpacity style={{ display: "flex", justifyContent: "center", alignItems: "center", height:20,backgroundColor: "#0093CE"}}>
           <Text style={{color: "white"}}>Presiona el icono de Barcode</Text>
         </TouchableOpacity>
      )}

      </View>
       {
        scanned && (
          <FAB
          icon="barcode-scan"
          style={styles.fab}
          onPress={() => setScanned(false)}
            color="white"
            />
        )
       }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  fab: {
    width: 70,
    height: 70,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 400,
    position: "absolute",
    bottom: 20,
    right: 20,
   backgroundColor: "#0093CE"
  }
});