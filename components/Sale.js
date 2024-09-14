import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import Barcode from './Barcode';
import { loginContext } from '../context/context';
import { DataTable, Provider } from 'react-native-paper';

export const Sale = () => {
  const [data, setData] = useState([]); // Inicializar como un array vacío
  const [total, setTotal] = useState(0); // Inicializar como 0
  const { setSalesToDrupal, scannedSaleCode } = useContext(loginContext);

  const handleGetItemToDrupal = async () => {
    try {
      const fetchedData = await setSalesToDrupal();
      console.log(fetchedData, "fetchedData");

      // Filtrar los datos basados en scannedSaleCode
      const filteredData = fetchedData.filter(item => item.code === scannedSaleCode);

      // Mapear los datos filtrados y agregarlos al estado acumulativo
      const newSales = filteredData.map(item => ({
        name: item.name,
        brand: item.brand,
        inventory: item.inventory,
        price: parseFloat(item.price), // Asegúrate de que price sea un número
      }));

      // Actualizar el estado con los nuevos datos acumulativos
      setData(prevData => [...prevData, ...newSales]);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  // Efecto para recalcular el total cada vez que `data` cambia
  useEffect(() => {
    const totalPrice = data.reduce((accumulator, item) => accumulator + item.price, 0);
    setTotal(totalPrice.toFixed(2)); // Ajusta el total a 2 decimales
  }, [data]); // Dependencia para recalcular cuando `data` cambia

  useEffect(() => {
    handleGetItemToDrupal();
  }, [scannedSaleCode]); // Dependencia añadida para actualizar datos cuando scannedSaleCode cambie

  return (
    <Provider>
      <View style={styles.container}>
        <Barcode /> 
        <Text style={styles.title}>Total: ${total}</Text>
        {data.length > 0 ? (
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ marginRight:-40}}>Products</DataTable.Title>
                <DataTable.Title style={{ marginLeft:65}}>Brand</DataTable.Title>
                <DataTable.Title numeric style={{ marginRight:30}}>Count</DataTable.Title>
                <DataTable.Title numeric>Price</DataTable.Title>
              </DataTable.Header>
              {data.map((item, index) => (
                <DataTable.Row
                  key={index} // Usar index como clave para filas
                  style={{
                    backgroundColor:
                      item.inventory !== undefined && item.inventory <= 0
                        ? '#ffeb3b' // Color para inventario bajo
                        : 'white', 
                  }}
                  onPress={() => {
                    // Aquí puedes añadir una función para manejar el clic en la fila
                    // showDialog();
                  }}
                >
                  <DataTable.Cell>
                    <Text>{item.name}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{item.brand}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell
                    numeric
                    style={{
                      backgroundColor: item.inventory === 0 ? 'red' : 'white',
                    }}
                  >
                    <Text style={{ fontSize: 20, marginRight: 20 }}>{item.inventory}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={{ color: item.inventory === 0 ? 'white' : 'black', fontSize: 20 }}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        ) : (
          <Text>No data available</Text> // Mensaje cuando no hay datos
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginVertical: 10
  },
});
