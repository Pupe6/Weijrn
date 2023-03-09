import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import AppContainer from "./src/components/app-container";
import BiometricsComponent from "./src/components/biometrics-component";
import SignInScreen from "./src/screens/sign-in";
import SignUpScreen from "./src/screens/sign-up";
import Navbar from "./src/components/navbar";
import AdminScreen from "./src/screens/control-panel";
import MyDrawer from "./src/components/navbar";

export default function App() {
	return (
		<AppContainer children={<MyDrawer />}>
			<StatusBar style="auto" />
		</AppContainer>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// });
