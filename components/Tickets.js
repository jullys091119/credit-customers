import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { loginContext } from '../context/context';

const Tickets = () => {
  const { getTicketsDrupal } = useContext(loginContext);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("")

  const fetchTickets = async () => {
    const response = await getTicketsDrupal();
    setTotal(response)
    let arr = [];
    response.forEach(element => {
      arr.push(element.description); // Assuming `element.description` is the array of items
    });
    setData(arr);
  };
  useEffect(() => {
    fetchTickets();
    console.log(total, "total")
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {data.length > 0 ? (
          data.map((items, index) => (
            <View key={index} style={styles.ticket}>
              <Text style={styles.header}>Ticket {index + 1}</Text>
              {items.map((item, itemIndex) => (
                <View key={itemIndex} style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <Text style={styles.detail}>Product: {item.name}</Text>
                  <Text style={styles.detail}>Price: ${item.price}</Text>
                </View>
              ))}
             <Text style={[styles.detail, { alignSelf: "flex-end", fontWeight: "900" }]}>Total: {total[index].total}</Text>
              <Text style={styles.footer}>Thank you for your purchase!</Text>
              <Button mode="contained" style={styles.button}>Capture Ticket</Button>
            </View>
          ))
        ) : (
          <Text>No tickets available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ticket: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  footer: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0093CE'
  },
});

export default Tickets;
