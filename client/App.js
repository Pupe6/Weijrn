import { StatusBar } from "expo-status-bar";
import AppContainer from "./src/components/app-container";
import MyDrawer from "./src/components/navbar";

// pass MyDrawer and ThemeToggle as children to AppContainer
export default function App() {
	return (
		<AppContainer>
			<MyDrawer />
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
