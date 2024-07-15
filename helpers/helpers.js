import { React, useContext, useEffect, useState, useRef } from "react";
import { Button, List, ListItem, Divider, Text } from "@ui-kitten/components";
import { Icon, Portal, Dialog, ActivityIndicator, Avatar } from "react-native-paper";
import { StyleSheet, View, Image, TouchableOpacity, TextInput } from "react-native";
import { loginContext } from "../context/context";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import PayUser from "../components/PayUser";

const ListAccessoriesShowcase = ({ navigation }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});
  const [total, setTotal] = useState("");
  const [valueSale, setValueSale] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [idUserSale, setIdUserSale] = useState("")
  const [containerVisible, setContainerVisible] = useState(false)
  const [fieldPayVisible, setFieldPayVisible] = useState(false)
  const [isSended, setIsSended] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [saleSuccess, setSaleSuccess] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [pay,setPay] = useState("")
  const [confetti, setConfetti] = useState(false)
  const { users, getCurrentUser, setShowHome, getSalesNoteBook, tk, alertErrorsSales,setUserName, userName } = useContext(loginContext);

  const currentSales = async () => {
    await getCurrentUser();
  };


  const addSalesCustomer = async (total) => {
    const currentDay = moment()
    if (total !== 0 && Math.sign(total) != -1) {
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

  //Cuando clikeo la letra
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setDialogVisible(false)
  };

  const payCountUser = async (pay) => {
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
            setConfetti(true)
          }
        } catch (error) {
          console.error(error, "error al actualizar");
        }
      }
      // Si todas las ventas se eliminaron correctamente, calculamos el nuevo valor de la venta y hacemos el registro de la venta.
      if (isLoaded) {
        const newValue = total - parseFloat(pay); // Restamos el pago al total.
        if (!isNaN(newValue) && newValue !== total && newValue !== pay) { // Verificamos si el nuevo valor es válido y diferente al total original.
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
     setSaleSuccess(false)
   
  };

  const renderItem = ({ item, index }) => {
    return (
      
      <ListItem
        onPress={() => handleItemClick(item)}
        style={[styles.container]}
        title={() => (
          <>
            <View style={[styles.containerItemName]}>
              <Avatar.Text label={item.name.charAt(0).toUpperCase()} size={45} style={{ backgroundColor: "#0093CE", }} />
              <Text style={styles.title}>{`  ${item.name.toUpperCase()} ${item.lastName.toUpperCase()}`}</Text>
            </View>
          </>
        )}

      />
    )
  };

  useEffect(() => {
    !dialogVisible ? setFieldPayVisible(true) : setFieldPayVisible(false)
  }, [dialogVisible])


  return (
    <>
      <List
        data={users}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        />
      <Portal>
       <PayUser modal={isModalVisible} 
       setModal={setModalVisible} total={total}
       payCountUser={payCountUser}
       setPay={setPay} 
       pay={pay}
       setConfetti={setConfetti} 
       confetti={confetti}
       />
        <Dialog
          visible={dialogVisible}
          onDismiss={handleDialogDismiss}
          style={{
            maxWidth: 318,
            marginHorizontal: "auto",
            marginVertical: 40,
            width: 340,
            height: 450,
            maxWidth: 432,
            margin: 40,
            opacity: 1,
            borderRadius: 0,
            zIndex:0,
            position: "relative"
          }}
        >
          <Dialog.Content style={[styles.containerDialog]}>
           
            <View style={[styles.containerSales]}>
              {selectedItem && (
                <>
                  <View style={[styles.containerUserName]}>
                    <TouchableWithoutFeedback
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3
                      }}
                      onPress={() => {
                        toggleModal()
                      }}
                    >
                      <Icon
                        source="cash-plus"
                        size={40}
                        color="#0093CE"
                        />
                      <Text style={{ color: "#0093CE" }}>Pagar</Text>
                    </TouchableWithoutFeedback>
                    <Text style={[styles.userSelected]}>
                      <Text style={[styles.nameUser]}>{selectedItem.name.toUpperCase()}</Text>
                    </Text>
                  </View>
          
                  <Divider />
                </>
              )}
              <View style={{ display: "flex", flexDirection: "row-reverse", gap: 10, marginVertical: 10 }}>
                <Text style={{ alignSelf: "flex-end", fontSize: 20, fontWeight: "700", color: "#464555" }}>${total}.00</Text>
              </View>
              <View style={{ height: 200, overflow: "scroll" }}>
                {/* {isLoaded && <ActivityIndicator animating={true} color="green" />} */}
                {total == 0 && <Text style={{ position: "absolute", top: 80, left: 90, color: "#464555" }}>Sin saldo Pendiente</Text>}
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => (
                    <>
                      <View style={[styles.containerTotal]}>
                        <View style={[styles.date]}>
                          <Icon
                            source="calendar-clock-outline"
                            color="#0093CE"
                            size={25}
                          />
                          <Text style={{ marginLeft: 20, fontWeight: "800", color: "#464555" }}>
                            {moment(item.date).format('L')} {"      "} {moment(item.date).format('LT')}{moment(item.date).format('a')}
                          </Text>
                        </View>
                        <Text style={{ fontWeight: "700", color: "#464555" }}>${item.total}.00</Text>
                      </View>
                      <Divider />
                    </>
                  )}
                />
              </View>
            </View>
            <View>
              <ActivityIndicator color="#0093CE" animating={isLoaded} style={styles.activityIndicator} />
              <TextInput
                placeholder="$"
                mode="flat"
                value={valueSale}
                onChangeText={(number) => setValueSale(number)}
                keyboardType="numeric"
                style={[styles.inputvalue]}
              />

            </View>
            <View style={{ width: 290, marginTop: 15, alignSelf: "center" }}>
              <Button mode="contained" style={{ backgroundColor: "#0093CE", borderWidth: 0 }} onPress={() => { addSalesCustomer() }}>Enviar</Button>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
      
    </>
  );

};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    textAlign: "center",
    color: "#ABA9BB"
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
    alignItems: "center",
    gap: 10
  },
  containerUserName: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#0093CE"
  },
  userSelected: {
    fontSize: 20
  },
  nameUser: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0093CE"
  },
  image: {
    width: 30,
    height: 30
  },
  inputvalue: {
    height: 45,
    borderRadius: 7,
    backgroundColor: "white",
    marginTop: 15,
    paddingHorizontal: 10,
    color: "#464555",
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
  pay: {
    fontSize: 10,
    textAlign: "center",

  }
});

export { ListAccessoriesShowcase };
