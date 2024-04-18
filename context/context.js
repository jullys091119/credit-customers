import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const loginContext = createContext();

const ProviderLogin = ({ children, navigation }) => {
  const [tkLogout, setTokenLogout] = useState("");
  const [tk, setTk] = useState("");
  const [users, setUsers] = useState("");
  const  [showHome, setShowHome] = useState(false)

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("@TOKEN");
    const token_logout = await AsyncStorage.getItem("@TOKEN_LOGOUT");
    console.log(token, "<<<<<<current token", token_logout);
    setTk(token);
    setTokenLogout(token_logout);
  };

  const login = async () => {
    const options = {
      method: "POST",
      url: "https://elalfaylaomega.com/credit-customer/user/login",
      params: { _format: "json" },
      data: { name: "admin", pass: "pass" },
    };
    try {
      const response = await axios.request(options);
      await AsyncStorage.setItem("@TOKEN", response.data.csrf_token);
      await AsyncStorage.setItem("@TOKEN_LOGOUT", response.data.logout_token);
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
          await AsyncStorage.removeItem("@TOKEN");
          await AsyncStorage.removeItem("@TOKEN_LOGOUT");
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
    console.log(letter)
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
    
    return axios.request(options).then(function (response) {
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
     getUsers,
     setUsers,
     users,
     getCurrentUser,
     setShowHome,
     showHome
     }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
