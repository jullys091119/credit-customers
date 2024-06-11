import { React, useContext } from "react";
import { View, Text, FlatList,StyleSheet } from "react-native";
import { loginContext } from "../context/context";
import { Icon } from "react-native-paper";

const Customers = () => {
  const { users } = useContext(loginContext);
  // console.log(users, "users");
  return (
    <FlatList
      data={users}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          {
            item.name!=="admin" && <Text style={styles.text}>{item.name}</Text>
          }
          <Icon/>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()} // Key extractor necesario para FlatList
    />
  );
};
const styles = StyleSheet.create({
  item: {
  
    marginHorizontal: 10,
    marginVertical: 10
  },
  text: {
    fontSize: 24,
  },
});
export default Customers;
