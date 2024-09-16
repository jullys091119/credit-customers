import React, { useState, useEffect, useContext,useRef } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { FAB, Provider as PaperProvider,Drawer } from 'react-native-paper';
import { loginContext } from "../context/context";
import { Audio } from 'expo-av';

export default function Barcode() {
  const  {
    setScannedSale,
    scannedSale,
    setSalesToDrupal,
    setDataDrupalSale,
    dataDrupalSale
  }  = useContext(loginContext)
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [codeScanner, setCodeScanner] = useState("")


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(()=> {

  },[codeScanner])
  
  const handleBarcodeScanned = async ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setScannedSale(true);
    await handleGetItemToDrupal(data)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleGetItemToDrupal = async (code) => {
    try {
      const fetchedData = await setSalesToDrupal();
      // console.log(fetchedData, "fetchedData");
      console.log(codeScanner, "scanedsalecode")
      // Filtrar los datos basados en scannedSaleCode
      const filteredData = fetchedData.filter(item => item.code === code);
      console.log(filteredData, "filtrados")

      // Mapear los datos filtrados y agregarlos al estado acumulativo
      const newSales = filteredData.map(item => ({
        name: item.name,
        brand: item.brand,
        inventory: item.inventory,
        price: parseFloat(item.price), // Asegúrate de que price sea un número
      }));
      
      // Actualizar el estado con los nuevos datos acumulativos
      // setDataDrupalSales(prevData => [...prevData, ...newSales])
      setDataDrupalSale(prevData => [...prevData, ...newSales])
      console.log(dataDrupalSale, "DATA DURPAL SALE")
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height:300, flexDirection: "column-reverse"}}>
        <CameraView
          onBarcodeScanned={scannedSale ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "upc_a"]   
          }}
          ref={cameraRef}
          enableTorch={true}
          autoFocus="on"
          style={StyleSheet.absoluteFillObject}
          />
          {scannedSale && (
         <TouchableOpacity style={{ display: "flex", justifyContent: "center", alignItems: "center", height:20,backgroundColor: "#0093CE"}}>
           <Text style={{color: "white"}}>Presiona el icono de Barcode</Text>
         </TouchableOpacity>
      )}
      </View>
       {
        scannedSale && (
          <FAB
          icon="barcode-scan"
          style={styles.fab}
          onPress={() => setScannedSale(false)}
            color="white"
            />
        )
       }
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