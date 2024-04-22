import { React, useContext, useEffect, useState } from "react";
import { Button, List, ListItem, Divider, Text } from "@ui-kitten/components";
import { Icon, Portal, Dialog, TextInput } from "react-native-paper";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { loginContext } from "../context/context";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import axios from "axios";

const ListAccessoriesShowcase = (props) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});
  const [total, setTotal] = useState("");
  const [valueSale, setValueSale] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [idUserSale, setIdUserSale]= useState("")
  const [userName, setUserName] = useState("")
  const { users, getCurrentUser, setShowHome, getSalesNoteBook, tk } = useContext(loginContext);

  const renderItemIcon = () => (
    <Icon source="account" color="#e6008c" size={30} />
  );
  

  const addSalesCustomer = () => {
    const options = {
      method: "POST",
      url: "https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: "Authorization: Basic YXBpOmFwaQ==",
        "Content-Type": "application/vnd.api+json",
        "X-CSRF-Token": tk,
      },

      data: {
        data: {
          type: "node--sales_notebook",
          attributes: {
            title: `Compra de ${userName}`,
            field_sales_date: "2024-04-19T12:00:00+00:00",
            field_sales_total: valueSale,
            field_sales_id_user: idUserSale
          },
        },
      },
    };

    if(valueSale !== "") {
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          setValueSale("")
        })
        .catch(function (error) {
          console.error(error);
        });
    } else  {
      alert("el valor que ingresaste esta vacio")
    }
  };

  const AddSalesIcon = () => (
    <TouchableOpacity
      onPress={() => {
        addSalesCustomer();
      }}
    >
      <Image
        style={{ width: 50, height: 50, alignSelf: "flex-end", marginTop: 10 }}
        source={require("../assets/images/add-to-cart.png")}
      />
    </TouchableOpacity>
  );


  const currentSales = async () => {
    await getCurrentUser();
  };

  const handleItemClick = async (item) => {
      setUserName(item.name)
      setIdUserSale(item.id)
      setSelectedItem(item);
      setDialogVisible(true);
      setInputVisible(true);
      await currentSales(item.id)
      const data = await getSalesNoteBook(item.id);
      setData(data);
      const salesTotal = data.reduce(
        (total, item) => parseInt(total) + parseInt(item.total),
        0
      );
      setTotal(salesTotal);
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      onPress={() => handleItemClick(item)}
      style={[styles.container]}
      title={() => (
        <>
          <View style={[styles.containerItemName]}>
            <Text style={styles.title}>{`${item.name.toUpperCase()}`}</Text>
            <Text style={styles.titleIndex}>{`${index + 1}`}</Text>
          </View>
        </>
      )}
      accessoryLeft={renderItemIcon}
    />
  );

  return (
    <>
      <List
        data={users}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
      />
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={handleDialogDismiss}
          style={{ height: 460, width: 310 }}
        >
          <Dialog.Content style={[styles.containerDialog]}>
            <View style={[styles.containerSales]}>
              {selectedItem && (
                <Text style={[styles.userSelected]}>
                  {`Selected item: `}
                  <Text style={[styles.nameUser]}>{selectedItem.name.toUpperCase()}</Text>
                </Text>
              )}
              <View style={{display:"flex",flexDirection: "row-reverse",gap: 10, marginVertical: 20}}>
                <Text style={{alignSelf: "flex-end"}}>{total}</Text>
                <Image style={[styles.image]} source={require('../assets/images/monedas.png')}/>
              </View>
              <View style={{ height: "57%", overflow: "scroll" }}>
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => (
                    <View style={[styles.containerTotal]}>
                      <View style={[styles.date]}>
                        <Image style={{width: 21, height: 21}}  source={require('../assets/images/calendario.png')}/>
                        <Text style={{marginLeft: 50}}>{moment(item.date).format("ll")}</Text>
                      </View>
                      <Text style={{fontWeight: "600"}}>${item.total}</Text>
                    </View>
                  )}
                />
              </View>
            </View>
            <View>
              <TextInput
                label="Add  sales value"
                value={valueSale}
                onChangeText={(number) => setValueSale(number)}
                keyboardType="numeric"
                right={<TextInput.Icon icon="cash" color="#DDDDDD" size={40} />}
                style={{marginTop: -39, backgroundColor: "white"}}
              />
            </View>
            <View style={{width: 60,alignSelf: "flex-end"}}>
              <AddSalesIcon />
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  containerDialog: {
    flex: 1,
  },
  date: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    width: "90%",
    display: "flex",
    gap: 20,
  },
  containerTotal: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 3, 
  },
  containerItemName: {
   display: "flex",
   flexDirection: "row",
   justifyContent:"space-between",
  },
  containerDialog:  {
    borderRadius: 12
  },
   userSelected: {
    fontSize: 20
   },
  nameUser: {
    fontSize: 20,
    fontWeight: "800"
  },
  image: {
    width: 30,
    height: 30
  }
});

export { ListAccessoriesShowcase };
