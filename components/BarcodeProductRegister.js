
import React, { useState, useEffect, useContext,useRef } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { CameraView, Camera, stopPreview } from "expo-camera";
import { FAB, Provider as PaperProvider, Drawer } from 'react-native-paper';
import { loginContext } from "../context/context";


export default function BarcodeProductRegister() {
	const cameraRef = useRef(null);
	const  { setScanCodeProduct} = useContext(loginContext)
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
		// alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		setScanCodeProduct(data)
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}



	return (
		<View style={{ height: 200, flexDirection: "column-reverse" }}>

			<CameraView
				onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
				barcodeScannerSettings={{
					barcodeTypes: ["ean13", "upc_a"]
				}}
				ref={cameraRef}
				enableTorch={false}
				autoFocus="on"
				style={StyleSheet.absoluteFillObject}
			/>

			{scanned && (
				<TouchableOpacity style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 20, backgroundColor: "#0093CE" }}>
					<Text style={{ color: "white" }}>Presiona el icono de Barcode</Text>
				</TouchableOpacity>
			)} 
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
	fab: {
		width: 70,
		height: 70,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 400,
		position: "absolute",
		bottom: -300,
		right: 10,
		zIndex: 100,
		backgroundColor: "#0093CE"
	}
});