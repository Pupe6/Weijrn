import { StatusBar } from "expo-status-bar";
import AppContainer from "./src/components/app-container";
import SignInScreen from "./src/screens/sign-in";
import SignUpScreen from "./src/screens/sign-up";
import Navbar from "./src/components/navbar";
import AdminScreen from "./src/screens/control-panel";
import MyDrawer from "./src/components/navbar";
import ThemeToggle from "./src/components/common/theme-toggle";

// pass MyDrawer and ThemeToggle as children to AppContainer
export default function App() {
	return (
		<AppContainer>
			<MyDrawer />
			{/* <ThemeToggle /> */}
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
