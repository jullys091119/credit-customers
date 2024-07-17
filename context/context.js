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
  const  [showHome, setShowHome] = useState(false)
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [sales, setSales] = useState([]) 
  const [mounted, setMounted] = useState(false)
  const [nameUser, setNameUser] = useState("")
  const [uidUser, setUidUser] = useState("")
  const [image, setImage] = useState("")
  const [smallPerfil, setSmallPerfil] = useState("")
  const [imagenStorage, setImagenStorage] = useState("")
  const [lastSales, setLastSales] = useState ("")
  const [roles , setRoles ] = useState("")
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [userName, setUserName] = useState("")
  const [total, setTotal] = useState("");
  const [idUserSale, setIdUserSale] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [valueSale, setValueSale] = useState("");
  const [date, setDate] = useState(null);
  const [msg, setMsg]= useState("")
  const [visibleModalReminders, setVisibleModalReminders] = useState(false);
 const [confetti, setConfetti] = useState(false)
 
  const getSalesNoteBook = async (id) => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook?filter[field_sales_id_user]='+ id,
    };  
    return await axios.request(options).then(function (response) {
     let totalSales = []
      response.data.data.forEach((data)=> {
        // console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<,")
      const dataSales =  {
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
      response.data.data.forEach((data)=> {
       const dataSales =  {
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
      data: { name: user , pass: pass },
    };
    try {
      const response = await axios.request(options);

      // console.log(response.data.current_user.roles)
      await AsyncStorage.setItem("@TOKEN", response.data.csrf_token);
      await AsyncStorage.setItem("@TOKEN_LOGOUT", response.data.logout_token);
      await AsyncStorage.setItem("@UID", response.data.current_user.uid);
      await AsyncStorage.setItem('@NAMEUSER',response.data.current_user.name)
      try {
        response.data.current_user!=undefined?await AsyncStorage.setItem("@ROLES", response.data.current_user.roles[1]):undefined
        // console.log("rol guardado")
      } catch (error) {
        console.log("No se gurado el rol")
      }
      checkLoginStatus()
      return response.status;
    } catch (error) {
      if(error.request.status==403) {
        return error.request.status
      } else if(error.request.status ==400) {
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
      headers: {'User-Agent': 'insomnia/8.6.1', 'Content-Type': 'application/json'}
    };
    return axios
    .request(options)
    .then(async function(response) {
    
      const allUsers = [];
      response.data.data.forEach(users => {
        // console.log(users.attributes, "usert")
        if(users.attributes.name !== undefined) {
          const user =  {
            name: users.attributes.name,
            id: users.attributes.drupal_internal__uid,
            lastName: users.attributes.field_user_lastname
          }
          allUsers.push(user)
        }
      });
      const filterUser  = allUsers.filter((user) => { 
        return user.name.charAt(0).toLowerCase() === letter.toLowerCase()
      })

      return filterUser

    }).catch(function(error) {
      console.log(error.config);
    })
  }

  const getCurrentUser = () => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/user/' + uidUser + '?_format=json',
      params: {_format: 'json'},
      headers: {'Content-Type': 'application/json', 'X-CSRF-Token': tk}
    };
    
    return axios.request(options).then(async function (response) {
      if(uidUser == response.data.uid[0].value ) {
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
      name:`raton.jpg`
    });  
 
      // Agrega el encabezado "Content-Disposition" con el nombre de archivo
      formData.append('Content-Disposition', 'attachment; filename="33.jpg"');
      // Agrega los encabezados necesarios
      const headers = {
        'Content-Type': 'application/octet-stream', // Cambiado a application/octet-stream
        'X-XSRF-Token': tk,
        'Authorization': 'Basic Og==',
        'Content-Disposition':`file; filename="${nameUser}.jpg"`
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
   
 
  const setPerfilProfileImages=async(url)=> {
    try {
      const key = `@PROFILE_${uidUser}`;
      await AsyncStorage.setItem(key, url)
    }catch (error) {
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
        text: 'Ok', onPress: ()=> console.log("cancel presed")
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
    console.log(date, "date")
    const today = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
    console.log(today)
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
            field_reminders_date: date!==null?formattedDate:today,
            field_reminders: msg,
          },
        },
      },
    };
  
    try {
      const response = await axios.request(options);
      if(response)  {
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
      headers: {'User-Agent': 'insomnia/8.6.1', 'Content-Type': 'application/json'}
    };
    return axios
    .request(options)
    .then(async function(response) {
      let currentReminders = []
      response.data.data.forEach((reminders)=> {
        const  note = {
          nid: reminders.attributes.drupal_internal__nid,
          msg: reminders.attributes.field_reminders,
          date: reminders.attributes.field_reminders_date
        }
        currentReminders.push(note)
      })
      return currentReminders
    }).catch(function(error) {
      console.log(error.config);
    })
  }
  const deleteReminders = (nid) => {
    console.log(nid, "nid");
  
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
        console.log(response, "Eliminación exitosa");
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
  
  async function sendPushNotification(expoPushToken) {
 
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Buenos días',
    body: 'Tarea nueva!',
    data: { someData: 'goes here' },
  };

  try {
    // Enviar el token a Drupal
    const options = {
      method: "POST",
      url: "https://elalfaylaomega.com/credit-customer/jsonapi/node/notification_push",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: "Authorization: Basic YXBpOmFwaQ==",
        "Content-Type": "application/vnd.api+json",
        
      },
      data: {
        data: {
          type: "node--reminders",
          attributes: {
            title: `Recordatorio`,
            field_token: expoPushToken
          
          },
        },
      },
    };

    try {
      const response = await axios.request(options);
      if(response)  {
       console.log(response)
      }
    } catch (error) {
      console.error(error.response.data, "error al ejecutar el listado de recordatorios");
    }

    // Enviar notificación a Expo
    const expoResponse = await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });

    console.log('Notificación enviada a Expo:', expoResponse.data);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
}


  

  useEffect(()=> {
  console.log(users, "users<")
  },[image])
  return ( 
    <loginContext.Provider value={{ login,
     logout, 
     tk,
     checkLoginStatus,
     loadProfileImageFromStorage,
     getSalesNoteBook,
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
     confetti,
     setVisibleModalReminders,
     getReminders,
     deleteReminders,
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
     msg
     }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
 