import { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const loginContext = createContext();

const ProviderLogin = ({ children, navigation }) => {
  const [tkLogout, setTokenLogout] = useState("");
  const [tk, setTk] = useState("")


  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("@TOKEN");
    const token_logout = await AsyncStorage.getItem("@TOKEN_LOGOUT");
    console.log(token, "<<<<<<current token", token_logout)
    setTk(token)
    setTokenLogout(token_logout);;
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

  return (
    <loginContext.Provider value={{login, logout, tk, checkLoginStatus }}>
      {children}
    </loginContext.Provider>
  );
};

export { ProviderLogin, loginContext };
