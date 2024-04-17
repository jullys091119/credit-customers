import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const AlphabetScreen = () => {
  // Array con todas las letras del abecedario
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
  const getCustomer = (letter) => {
    console.log(letter)
  }

  return (
    <FlatList
      data={alphabet}
      numColumns={3} // Número de columnas en el grid
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.text} onPress={()=> {getCustomer(item)}}>{item}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()} // Key extractor necesario para FlatList
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 50,
    backgroundColor: '#DDDDDD',
    marginTop: 30
  },
  text: {
    fontSize: 24,
  },
});

export default AlphabetScreen;
