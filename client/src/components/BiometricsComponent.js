import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import Navbar from "./navbar";
import AdminComponent from "./AdminComponent";

export default function BiometricsComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function authenticate() {
        const result = await LocalAuthentication.authenticateAsync();
    }
    authenticate();
    console.log("result");
    setIsAuthenticated(true);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{isAuthenticated == true ? <Navbar /> : "Uh oh! Access Denied"}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }          
})