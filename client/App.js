import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppContainer from "./src/components/app-container";
// import AdminComponent from "./src/components/AdminComponent";
import BiometricsComponent from "./src/components/BiometricsComponent";
import MainScreen from "./src/screens/home";
import SignInScreen from "./src/screens/sign-in";
import SignUpScreen from "./src/screens/sign-up";
import Navbar from "./src/components/navbar";
import AdminScreen from "./src/screens/control-panel";

export default function App() {
	return (
		<AppContainer>
			<AdminScreen />
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
