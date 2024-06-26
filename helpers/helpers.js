import { React, useContext, useEffect, useState } from "react";
import { Button, List, ListItem, Divider, Text } from "@ui-kitten/components";
import { Icon, Portal, Dialog, ActivityIndicator, Avatar } from "react-native-paper";
import { StyleSheet, View, Image, TouchableOpacity, TextInput } from "react-native";
import { loginContext } from "../context/context";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import axios from "axios";


const ListAccessoriesShowcase = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});
  const [total, setTotal] = useState("");
  const [valueSale, setValueSale] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [idUserSale, setIdUserSale] = useState("")
  const [userName, setUserName] = useState("")
  const [containerVisible, setContainerVisible] = useState(false)
  const [pay, setPay] = useState("")
  const [fieldPayVisible, setFieldPayVisible] = useState(false)
  const [isSended, setIsSended] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [saleSuccess, setSaleSuccess] = useState(false)
  const  [selectionMode, setSelectionMode] = useState("")
  const { users, getCurrentUser, setShowHome, getSalesNoteBook, tk, alertErrorsSales, alertPay} = useContext(loginContext);
  const  SalesPaySuccess = () => (
    <Icon source="check-all" color="#e6008c" size={30} />
  )

  const addSalesCustomer = async(total) => { 
    const currentDay = moment()
    if(total !== 0 && Math.sign(total) != -1) {
      setIsLoaded(true)
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
              field_sales_date: currentDay.format(),
              field_sales_total: total ? total : valueSale,
              field_sales_id_user: idUserSale
            },
          },
        },
      };
        axios
          .request(options)
          .then(async function (response) {
            setValueSale("")
            setIsSended(true)
            if (response.data) {
             setIsLoaded(false)
              setSaleSuccess(true)
              const data = await getSalesNoteBook(idUserSale)
              setData(data)
              const salesTotal = data.reduce(
                (total, item) => parseInt(total) + parseInt(item.total),
                0
              );
             
              setTotal(salesTotal);
              setSaleSuccess(false)
            }
            
          })
          .catch(function (error) {
            console.error(error, "error al ejecutar el listado de ventas");
          });

    
    } else {
      setTotal(0)
      setData("")
    }
  };
  const AddSalesIcon = () => (
    <TouchableOpacity
      onPress={() => {
        addSalesCustomer();
      }}
      style={{ marginTop: 20, marginLeft: 20 }}
    >
      <Icon
        size={40}
        color="#e6008c"
        source="send"
      />
    </TouchableOpacity>
  );

  const AddPayIcon = () => (
    <TouchableOpacity
      onPress={() => {
        payCountUser()
      }}
    >
      <Image
        source={require('../assets/images/tarjeta.png')}
        style={{ width: 60, height: 60, marginVertical: 10 }}
      />
    </TouchableOpacity>
  );

  const currentSales = async () => {
    await getCurrentUser();
  };

  const handleItemClick = async (item) => {
    try {
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
      setContainerVisible(true)
    } catch (error) {
      setContainerVisible(false)
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    setSelectedItem(null);
  };

  useEffect(()=> {
   !dialogVisible?setFieldPayVisible(true):setFieldPayVisible(false)
  },[dialogVisible])

  const renderItem = ({ item, index }) => {
    return (
      <ListItem
        onPress={() => handleItemClick(item)}
        style={[styles.container]}
        title={() => (
          <>
            <View style={[styles.containerItemName]}>
            <Avatar.Text label={item.name.charAt(0).toUpperCase()}  size={45} />
              <Text style={styles.title}>{`  ${item.name.toUpperCase()} ${item.lastName.toUpperCase()}`}</Text>
            </View>
          </>
        )}
      
      />
    )
    };

  const openInputPay = async () => {
    setFieldPayVisible(!fieldPayVisible); // Cambia la visibilidad del campo de pago
    let message = fieldPayVisible ? "¿Desea cambiarse al modo agregar ventas?" : "¿Desea abonar o liquidar una cuenta?";
    const selection = await alertPay(message); // Espera la respuesta del usuario
    setSelectionMode(selection); // Establece el modo de selección basado en la respuesta
  }

  const payCountUser = async () => {
    setFieldPayVisible(true);
    let idSales = data.map((item) => item.id); // Asumo que necesitas esto independientemente de otros factores.
    let isLoaded = false;
    if (idSales.length > 0 && pay !== "" && !isNaN(pay)) { // Verificamos si hay ventas y si se proporciona un valor de pago válido.
        setIsLoaded(true);
        for (const id of idSales) {
            try {
                const response = await axios.delete(`https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook/${id}`, {
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: 'Basic YXBpOmFwaQ=='
                    }
                });

                if (response.status === 204) {
                    isLoaded = true;
                    setSaleSuccess(true);
                }
            } catch (error) {
                console.error(error, "error al actualizar");
            }
        }
        // Si todas las ventas se eliminaron correctamente, calculamos el nuevo valor de la venta y hacemos el registro de la venta.
        if (isLoaded) {
          const newValue = total - parseFloat(pay); // Restamos el pago al total.
          if (!isNaN(newValue) && newValue !== total && newValue !== pay ) { // Verificamos si el nuevo valor es válido y diferente al total original.
              addSalesCustomer(newValue);
              setValueSale("");
              setPay("");
            } else {
                console.error("Error en el cálculo del nuevo valor de la venta.");
            }
        }
    } else { 
      alertErrorsSales("No puedes dejar el campo vacío o cuenta sin adeudo"); // Alerta si hay problemas con los datos de la venta.
    }

    setIsLoaded(false);
    setSaleSuccess(false);
};
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
          style={{ height: 470, width: 310 }}
          >
          <Dialog.Content style={[styles.containerDialog]}>
            <View style={{position: "absolute", bottom: 93, right: 30, zIndex: 90, borderRadius: 100, padding: 10}}>
              { saleSuccess && <SalesPaySuccess/>}
            </View>
        
            <View style={[styles.containerSales]}>
              {selectedItem && (
                 <>
                  <View style={[styles.containerUserName]}>
                  <Avatar.Text size={24} label={selectedItem.name.charAt(0).toUpperCase()} />
                    <Text style={[styles.userSelected]}>
                      <Text style={[styles.nameUser]}>{selectedItem.name.toUpperCase()}</Text>
                    </Text>
                    <TouchableOpacity onPress={() => { openInputPay() }}>
                      <Image style={{ width: 45, height: 45 }} source={require("../assets/images/payment.png")} />
                    </TouchableOpacity>
                  </View>
                  <Divider/>
                 </>
                
              )}
              <View style={{ display: "flex", flexDirection: "row-reverse", gap: 10, marginVertical: 10 }}>
                <Text style={{ alignSelf: "flex-end", fontSize: 20, fontWeight: "700" }}>${total}.00</Text>
                <Image style={[styles.image]} source={require('../assets/images/monedas.png')} />
              </View>
              <View style={{ height: "54%", overflow: "scroll" }}>
                {!containerVisible && <ActivityIndicator animating={true} color="red" />}
                {total==0&&<Text style={{position: "absolute", top: 80, left: 60, color: "gray"}}>Sin saldo Pendiente</Text>}
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => (
                    <>
                    <View style={[styles.containerTotal]}>
                      <View style={[styles.date]}>
                        <Image style={{ width: 21, height: 21 }} source={require('../assets/images/calendario.png')} />
                        <Text style={{ marginLeft: 20, fontWeight: "800" }}>{moment(item.date).format("ll")}</Text>
                      </View>
                      <Text style={{ fontWeight: "700" }}>${item.total}.00</Text>
                    </View>
                    <Divider/>
                    </>
                  )}
                />
              </View>
            </View>
            <View>
              <ActivityIndicator color="#e6008c" animating={isLoaded} style={styles.activityIndicator} />
              {
                !fieldPayVisible  ?
                  <TextInput
                    placeholder="Venta"
                    mode="flat"
                    value={valueSale}
                    onChangeText={(number) => setValueSale(number)}
                    keyboardType="numeric"
                    style={[styles.inputvalue]}
                    /> :
                    fieldPayVisible && <TextInput
                    placeholder="Pagar/Abonar"
                    mode="flat"
                    value={pay}
                    onChangeText={(number) => setPay(number)}
                    keyboardType="numeric"
                    style={[styles.inputvalue]}
                 
                  />
              }
            </View>
            <View style={{ width: 60, alignSelf: "flex-end", display: "flex"}}>
              {!fieldPayVisible ?<AddSalesIcon />:<AddPayIcon/>}
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
    gap: 10
  },
  containerUserName: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
  },
  inputvalue: {
    height: 45,
    borderRadius: 7,
    backgroundColor: "white",
    marginTop: -20,
    paddingHorizontal: 10
  },
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    right: 20,
    bottom: 10,
  },
  Snackbar: {
    flex: 1,
    justifyContent: 'space-between',

  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export { ListAccessoriesShowcase};
