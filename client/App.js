import { StatusBar } from "expo-status-bar";
import AppContainer from "./src/components/app-container";
import Navbar from "./src/components/navbar";

export default function App() {
	return (
		<AppContainer>
			<Navbar />
			<StatusBar style="auto" />
		</AppContainer>
	);
}
