import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64';
import { Alert } from "react-native";
import moment from "moment";
import 'moment/locale/es';


const loginContext = createContext();
// Configura el módulo base-64
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}


const ProviderLogin = ({ children, navigation }) => {
  const [tkLogout, setTokenLogout] = useState("");
  const [tk, setTk] = useState("");
  const [users, setUsers] = useState("");
  const [showHome, setShowHome] = useState(false)
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [sales, setSales] = useState([])
  const [mounted, setMounted] = useState(false)
  const [nameUser, setNameUser] = useState("")
  const [uidUser, setUidUser] = useState("")
  const [image, setImage] = useState("")
  const [smallPerfil, setSmallPerfil] = useState("")
  const [imagenStorage, setImagenStorage] = useState("")
  const [lastSales, setLastSales] = useState("")
  const [roles, setRoles] = useState("")
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [userName, setUserName] = useState("")
  const [total, setTotal] = useState("");
  const [idUserSale, setIdUserSale] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [valueSale, setValueSale] = useState("");
  const [date, setDate] = useState(null);
  const [msg, setMsg] = useState("")
  const [visibleModalReminders, setVisibleModalReminders] = useState(false);
  const [confetti, setConfetti] = useState(false)
  const [dataToken, setDataToken] = useState("")
  const [tokenFirebaseAuth0, setTokenFirebaseAuth0] = useState("");
  const [scanCodeProduct, setScanCodeProduct] = useState("")
  const [nameProduct, setNameProduct] = useState('')
  const [priceProduct, setPriceProduct] = useState("")
  const [brandName, setBranName] = useState("")
  const [Inventory, setInventory] = useState("")
  const [scannedSale, setScannedSale] = useState(false);
  const [scannedSaleCode, setScannedSaleCode] = useState("")
  const [dataDrupalSale, setDataDrupalSale] = useState([])
  const [newTicket, setNewTicket] = useState([])
  const [nameProductsInventory, setNameProductsInventory ] = useState([]);



  const getSalesNoteBook = async (id) => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook?filter[field_sales_id_user]=' + id,
    };
    return await axios.request(options).then(function (response) {
      let totalSales = []
      response.data.data.forEach((data) => {
        // console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<,")
        const dataSales = {
          id: data.id,
          date: data.attributes.field_sales_date,
          total: data.attributes.field_sales_total
        }
        totalSales.push(dataSales)
      })
      return totalSales
    }).catch(function (error) {
      console.error(error);
    });
  }


  const getSalesNoteBookHome = async () => {
    const uid = await AsyncStorage.getItem("@UID");
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook?filter[field_sales_id_user]=' + uid,
    };
    return await axios.request(options).then(function (response) {
      let totalSales = []
      response.data.data.forEach((data) => {
        const dataSales = {
          date: data.attributes.field_sales_date,
          total: data.attributes.field_sales_total
        }
        setSales((prevSales) => [...prevSales, dataSales]); // Actualiza el estado de sales
        setLastSales()
        totalSales.push(dataSales); // 
      })
      return totalSales
    }).catch(function (error) {
      console.error(error);
    });
  }

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("@TOKEN");
    const token_logout = await AsyncStorage.getItem("@TOKEN_LOGOUT");
    const uidUser = await AsyncStorage.getItem('@UID')
    const nameCurrenUser = await AsyncStorage.getItem('@NAMEUSER')
    const rol = await AsyncStorage.getItem("@ROLES")
    setRoles(rol)
    setTk(token);
    setUidUser(uidUser)
    setTokenLogout(token_logout);
    setNameUser(nameCurrenUser)
  };

  const login = async () => {
    const options = {
      method: "POST",
      url: "https://elalfaylaomega.com/credit-customer/user/login",
      params: { _format: "json" },
      data: { name: user, pass: pass },
    };
    try {
      const response = await axios.request(options);

      // console.log(response.data.current_user.roles)
      await AsyncStorage.setItem("@TOKEN", response.data.csrf_token);
      await AsyncStorage.setItem("@TOKEN_LOGOUT", response.data.logout_token);
      await AsyncStorage.setItem("@UID", response.data.current_user.uid);
      await AsyncStorage.setItem('@NAMEUSER', response.data.current_user.name)
      try {
        response.data.current_user != undefined ? await AsyncStorage.setItem("@ROLES", response.data.current_user.roles[1]) : undefined
        // console.log("rol guardado")
      } catch (error) {
        console.log("No se gurado el rol")
      }
      checkLoginStatus()
      return response.status;
    } catch (error) {
      if (error.request.status == 403) {
        return error.request.status
      } else if (error.request.status == 400) {
        return error.request.status
      }
    };
  }

  const logout = () => {
    const options = {
      method: "GET",
      url: "https://elalfaylaomega.com/credit-customer/user/logout",
      params: { _format: "json", token: tkLogout },
      headers: { "User-Agent": "insomnia/8.6.1" },
    };
    axios
      .request(options)
      .then(async (response) => {

        try {
          await AsyncStorage.removeItem("@NAMEUSER");
          await AsyncStorage.removeItem("@TOKEN");
          await AsyncStorage.removeItem("@TOKEN_LOGOUT");
          await AsyncStorage.removeItem("@UID");
          await AsyncStorage.removeItem("@ROLES");
          console.log("Cleared tokens");
        } catch (error) {
          console.error("Error clearing tokens:", error);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const getUsers = (letter) => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/user/user',
      headers: { 'User-Agent': 'insomnia/8.6.1', 'Content-Type': 'application/json' }
    };
    return axios
      .request(options)
      .then(async function (response) {

        const allUsers = [];
        response.data.data.forEach(users => {
          // console.log(users.attributes, "usert")
          if (users.attributes.name !== undefined) {
            const user = {
              name: users.attributes.name,
              id: users.attributes.drupal_internal__uid,
              lastName: users.attributes.field_user_lastname
            }
            allUsers.push(user)
          }
        });
        const filterUser = allUsers.filter((user) => {
          return user.name.charAt(0).toLowerCase() === letter.toLowerCase()
        })

        return filterUser

      }).catch(function (error) {
        console.log(error.config);
      })
  }

  const getCurrentUser = () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/user/' + uidUser + '?_format=json',
      params: { _format: 'json' },
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': tk }
    };

    return axios.request(options).then(async function (response) {
      if (uidUser == response.data.uid[0].value) {
        loadProfileImageFromStorage()
      }
      return response.data.status;
    }).catch(function (error) {
      console.error(error);
    });
  }


  const uploadPictureUser = async (base64Data) => {
    url = 'https://elalfaylaomega.com/credit-customer/file/upload/user/user/user_picture';
    // Convierte la imagen base64 en un ArrayBuffer
    const binaryData = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
    // Crea un objeto FormData para enviar la imagen como un archivo binario
    const formData = new FormData();
    formData.append('file', {
      uri: 'data:application/octet-stream;base64,' + base64Data,
      type: 'application/octet-stream',
      name: `raton.jpg`
    });

    // Agrega el encabezado "Content-Disposition" con el nombre de archivo
    formData.append('Content-Disposition', 'attachment; filename="33.jpg"');
    // Agrega los encabezados necesarios
    const headers = {
      'Content-Type': 'application/octet-stream', // Cambiado a application/octet-stream
      'X-XSRF-Token': tk,
      'Authorization': 'Basic Og==',
      'Content-Disposition': `file; filename="${nameUser}.jpg"`
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: binaryData, // Cambiado a binaryData
      });
      const responseData = await response.json();
      setPerfilProfileImages(responseData.uri[0].url)
      loadProfileImageFromStorage()
    } catch (error) {
      console.error(error);
    }
  }


  const pickImagePerfil = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (!result.canceled) {
      // Luego, puedes enviar la imageBase64 al servidor en lugar de result.assets[0].uri
      const base64ImageData = result.assets[0].base64
      uploadPictureUser(base64ImageData);
    }
  };


  const setPerfilProfileImages = async (url) => {
    try {
      const key = `@PROFILE_${uidUser}`;
      await AsyncStorage.setItem(key, url)
    } catch (error) {
      console.log(error)
    }
  }

  const loadProfileImageFromStorage = async () => {
    try {
      // Cargar la foto de perfil desde AsyncStorage usando la  clave única (UID)
      const key = `@PROFILE_${uidUser}`;
      const picture = await AsyncStorage.getItem(key);
      setImage(picture);
      setSmallPerfil(picture)
    } catch (error) {
      console.log(error);
    }
  }

  const alertErrorsSales = (mnsg) => {
    Alert.alert('Error', mnsg, [
      {
        text: 'Ok', onPress: () => console.log("cancel presed")
      }
    ]
    )
  }

  const alertPay = async (mnsg) => {
    return new Promise((resolve, reject) => {
      Alert.alert('Selecciona modo', mnsg, [
        {
          text: 'Ok'
        }
      ]);
    });
  }

  const addReminders = async (msg, date) => {
    const today = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');

    const formattedDate = moment(date).utc().format(); // Use `.utc()` to get the correct UTC format

    const options = {
      method: "POST",
      url: "https://elalfaylaomega.com/credit-customer/jsonapi/node/reminders",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: "Authorization: Basic YXBpOmFwaQ==",
        "Content-Type": "application/vnd.api+json",
        "X-CSRF-Token": tk,
      },
      data: {
        data: {
          type: "node--reminders",
          attributes: {
            title: `Recordatorio de ${nameUser}`,
            field_reminders_date: date !== null ? formattedDate : today,
            field_reminders: msg,
          },
        },
      },
    };

    try {

      const response = await axios.request(options);
      if (response) {
        setMsg("")
        setVisibleModalReminders(false)
      }
    } catch (error) {
      console.error(error.response.data, "error al ejecutar el listado de recordatorios");
    }
  };


  const getReminders = () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/reminders',
      headers: { 'User-Agent': 'insomnia/8.6.1', 'Content-Type': 'application/json' }
    };
    return axios
      .request(options)
      .then(async function (response) {
        let currentReminders = []
        response.data.data.forEach((reminders) => {
          const note = {
            nid: reminders.attributes.drupal_internal__nid,
            msg: reminders.attributes.field_reminders,
            date: reminders.attributes.field_reminders_date
          }
          currentReminders.push(note)
        })
        return currentReminders
      }).catch(function (error) {
        console.log(error.config);
      })
  }
  const deleteReminders = (nid) => {


    const url = `https://elalfaylaomega.com/credit-customer/node/` + nid;

    const options = {
      method: 'DELETE',
      url: url,
      headers: {
        Accept: "application/vnd.api+json",
        "Authorization": "Basic YXBpOmFwaQ==",
        "Content-Type": "application/vnd.api+json",
      },
    };

    return axios.request(options)
      .then(response => {
        console.log("Eliminación exitosa");
      })
      .catch(error => {
        if (error.response) {
          console.log('Error en la respuesta:', error.response.data);
          console.log('Código de estado:', error.response.status);
          console.log('Encabezados:', error.response.headers);
        } else if (error.request) {
          console.log('Error en la solicitud:', error.request);
        } else {
          console.log('Error:', error.message);
        }
        console.log('Configuración de la solicitud:', error.config);
      });
  };


  // Send device token to Drupal
  const sendTokenDevices = async (tokenDevice) => {
    const token = await AsyncStorage.getItem("@TOKEN");
    const tokenDeviceDrupalNotify = await getTokenDevices();
    if (!tokenDeviceDrupalNotify.includes(tokenDevice)) {
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
        headers: {
          Accept: 'application/vnd.api+json',
          'Authorization': 'Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': token,
        },
        data: {
          data: {
            type: 'node--notification-push',
            attributes: {
              title: 'tokens guardados',
              field_token: tokenDevice,
            },
          },
        },
      };

      try {
        await axios.request(options);
        console.log('Token sent to Drupal successfully');
      } catch (error) {
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
          // http.ClientRequest en node.js
          console.log(error.request);
        } else {
          // Algo paso al preparar la petición que lanzo un Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    } else {
      console.log("Token ya existe en Drupal");
    }
  };

  const setTokensNotifications = async (expoPushToken) => {
    console.log(expoPushToken, "data context")

    try {
      // Enviar el token a Drupal
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: 'Authorization: Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': tk,
        },
        data: {
          data: {
            type: 'node--notification-push',
            attributes: {
              title: 'tokens guardados',
              field_token: expoPushToken,
            },
          },
        },
      };

      try {
        const response = await axios.request(options);
        if (response) {
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      }




    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }



  const fetchToken = async () => {
    try {
      const response = await axios.get("https://extraordinary-tenderness-production.up.railway.app/api/token");
      if (response.data && response.data.token) {
        const token = response.data.token;
        setTokenFirebaseAuth0(token);
        return token;
      } else {
        console.error('Token not found in response');
        return null;
      }
    } catch (error) {
      // Maneja errores y muestra información detallada
      if (error.response) {
        // La solicitud se hizo y el servidor respondió con un estado de error
        console.error('Error fetching token:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        console.error('Error fetching token: No response received', {
          request: error.request,
        });
      } else {
        // Algo salió mal al configurar la solicitud
        console.error('Error fetching token:', {
          message: error.message,
        });
      }
      return null;
    }
  };



  // Get token devices from Drupal
  const getTokenDevices = async () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
      }
    };

    try {
      const response = await axios.request(options);
      const ids = response.data.data.map(token => token.attributes.field_token);
      return ids;
    } catch (error) {
      console.error('Error fetching tokens from Drupal:', error);
      return [];
    }
  };


  // Send FCM notification
  const sendFCMNotification = async (msg) => {
    const tokenDeviceDrupalNotify = await getTokenDevices();
    const tokenDevice = await AsyncStorage.getItem("TK-NOTY");
    const FCM_URL = 'https://fcm.googleapis.com/v1/projects/credit-customers-69505/messages:send';
    const FCM_SERVER_KEY = tokenFirebaseAuth0;
    console.log(FCM_SERVER_KEY, "fcm server")

    const filter = tokenDeviceDrupalNotify.filter((tk) => tk !== tokenDevice)

    for (const token of filter) {
      try {
        const response = await axios.post(
          FCM_URL,
          {
            message: {
              token: token,
              notification: {
                title: "Abarrotes Juliancito 🏪",
                body: `📩 Recordatorio Nuevo: ${msg}`,
              },
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${FCM_SERVER_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Notification sent successfully:', response.data);
      } catch (error) {
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
          // http.ClientRequest en node.js
          console.log(error.request);
        } else {
          // Algo paso al preparar la petición que lanzo un Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
    }
  };

  const setNewProductToDrupal = async (code, name, brand, price, count) => {
    console.log(code, " ", name, ' ', brand, " ", price, " ", count)

    try {
      // Enviar el token a Drupal
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/inventario_productos',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: 'Authorization: Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': tk,
        },
        data: {
          data: {
            type: 'node--inventario_productos',
            attributes: {
              title: `Producto ${name} guardado exitosamente`,
              field_codigo_producto: code,
              field_nombre_producto: name,
              field_marca_producto: brand,
              field_precio_producto: price,
              field_inventario_producto: count,
            }
          },
        },
      };

      try {
        const response = await axios.request(options);
        if (response) {
        }
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }


  const setSalesToDrupal = async () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/inventario_productos',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
      },
    }
    const response = await axios.request(options);
    let details = []
    const data = response.data.data.map((data) => data.attributes)
    for (const key in data) {

      const listSale = {
        code: data[key].field_codigo_producto,
        inventory: data[key].field_inventario_producto,
        brand: data[key].field_marca_producto,
        name: data[key].field_nombre_producto,
        price: data[key].field_precio_producto
      }
      details.push(listSale)

    }

    return details

  }

  const sendSalesToDrupal = async (array, total) => {
    const arrString = JSON.stringify(array);
    // console.log(arrString, "arr")
    try {
      // Log para verificar los datos
      console.log(array);
      // Configuración de la solicitud
      const options = {
        method: 'POST',
        url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/all_sales',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: 'Authorization: Basic YXBpOmFwaQ==',
          'Content-Type': 'application/vnd.api+json',
          'X-CSRF-Token': tk,
        },
        data: {
          data: {
            type: 'node--all_sales',
            attributes: {
              title: `Venta realizada exitosamente`,
              field_descripcion_venta: arrString,
              field_total_producto_venta: total
            }
          }
        },
      }

      // Hacer la solicitud
      const response = await axios(options);
      console.log('Response:', response.data); // Log para verificar la respuesta

    } catch (error) {
      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js
        console.log(error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  };


  const getTicketsDrupal = async () => {
    options = {
      method: "GET",
      url: "https://elalfaylaomega.com/credit-customer/jsonapi/node/all_sales",
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
        'X-CSRF-Token': tk,
      }
    }

    const response = await axios(options)
    let sendItem = []
    const currentTickets = response.data.data.map((item, index) => ({
      id: index,
      description: JSON.parse(item.attributes.field_descripcion_venta),
      total: item.attributes.field_total_producto_venta
    }))
    sendItem.push(currentTickets)
    let auxArr;
    for (const key in sendItem) {
      auxArr = sendItem[key]
    }

    return auxArr
  }

  const getInventoryProducts = async () => {
    options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/inventario_productos',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: 'Authorization: Basic YXBpOmFwaQ==',
        'Content-Type': 'application/vnd.api+json',
        'X-CSRF-Token': tk,
      }
    }

    const response = await axios(options)
    if (response.status === 200) {
      let names = []
      response.data.data.forEach((el)=> {
        names.push(el.attributes.field_nombre_producto)
      })
      setNameProductsInventory(names)
    }
  }

  useEffect(() => {
    getTicketsDrupal();
    setSalesToDrupal();
    fetchToken();
    getInventoryProducts();
  }, [dataToken])
  return (
    <loginContext.Provider value={{
      login,
      logout,
      tk,
      checkLoginStatus,
      loadProfileImageFromStorage,
      getSalesNoteBook,
      setTokensNotifications,
      getSalesNoteBookHome,
      getCurrentUser,
      getUsers,
      pickImagePerfil,
      setUsers,
      setMounted,
      setShowHome,
      setIsDialogVisible,
      alertErrorsSales,
      setTotal,
      setModalVisible,
      setUserName,
      setIdUserSale,
      setUser,
      setPass,
      setValueSale,
      setTotal,
      alertPay,
      addReminders,
      setDate,
      setMsg,
      setConfetti,
      setDataToken,
      setScanCodeProduct,
      setNameProduct,
      setPriceProduct,
      setBranName,
      setInventory,
      setVisibleModalReminders,
      getReminders,
      deleteReminders,
      sendFCMNotification,
      sendTokenDevices,
      setNewProductToDrupal,
      setSalesToDrupal,
      setScannedSale,
      getTicketsDrupal,
      scannedSaleCode,
      setScannedSaleCode,
      dataDrupalSale,
      setDataDrupalSale,
      sendSalesToDrupal,
      scannedSale,
      brandName,
      priceProduct,
      scanCodeProduct,
      dataToken,
      confetti,
      nameProduct,
      Inventory,
      visibleModalReminders,
      date,
      users,
      user,
      pass,
      sales,
      mounted,
      nameUser,
      uidUser,
      image,
      smallPerfil,
      roles,
      modalVisible,
      userName,
      idUserSale,
      total,
      valueSale,
      msg,
      nameProductsInventory
    }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
