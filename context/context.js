import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64';
import { Alert } from "react-native";


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
      console.log(response.data, "response")
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
    }
  }; 

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
        console.log(users.attributes, "usert")
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

  
  
  
  useEffect(()=> {
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
     setUser,
     setPass,
     alertErrorsSales,
     alertPay,
     users,
     user,
     pass,
     showHome,
     sales,
     mounted,
     nameUser,
     uidUser,
     image,
     smallPerfil,
     roles
     }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
 