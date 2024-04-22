import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const loginContext = createContext();

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

  const getSalesNoteBook = async (id) => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook?filter[field_sales_id_user]='+ id,
    };  
    return await axios.request(options).then(function (response) {
     let totalSales = []
      response.data.data.forEach((data)=> {
      const dataSales =  {
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
      // console.log(response.data.current_user.uid, "current user")
      await AsyncStorage.setItem("@TOKEN", response.data.csrf_token);
      await AsyncStorage.setItem("@TOKEN_LOGOUT", response.data.logout_token);
      await AsyncStorage.setItem("@UID", response.data.current_user.uid);
      await AsyncStorage.setItem('@NAMEUSER',response.data.current_user.name)
      checkLoginStatus()
      return response.status;
    } catch (error) {
      console.error("Login error:", error);
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
      .then(async () => {
        try {
          await AsyncStorage.removeItem("@NAMEUSER");
          await AsyncStorage.removeItem("@TOKEN");
          await AsyncStorage.removeItem("@TOKEN_LOGOUT");
          await AsyncStorage.removeItem("@UID");
          // console.log("Cleared tokens");
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
        if(users.attributes.name !== undefined) {
          const user =  {
            name: users.attributes.name,
            id: users.attributes.drupal_internal__uid
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

  const getCurrentUser = (id) => {
    const options = {
      method: 'GET',
      url: 'https://elalfaylaomega.com/credit-customer/user/1?_format=json',
      params: {_format: 'json'},
      headers: {'Content-Type': 'application/json', 'X-CSRF-Token': tk}
    };
    
    return axios.request(options).then(async function (response) {
      return response.data.status; 
    }).catch(function (error) {
      console.error(error);
    });
  } 



  return (
    <loginContext.Provider value={{ login,
     logout,
     tk,
     checkLoginStatus,
     getSalesNoteBook,
     getSalesNoteBookHome,
     getCurrentUser,
     getUsers,
     setUsers,
     users,
     setUser,
     setPass,
     user,
     pass,
     setShowHome,
     showHome,
     setMounted,
     sales,
     mounted,
     nameUser,
     uidUser
     }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
