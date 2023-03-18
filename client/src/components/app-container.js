import * as React from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/authContext";
import theme from "../theme";
import { ThemeToggle } from "./common/theme-toggle";
import MyDrawer from "./navbar";

export default function AppContainer() {
	global.refresh = 0;

	return (
		<AuthProvider>
			<NavigationContainer>
				<NativeBaseProvider theme={theme}>
					<MyDrawer />
				</NativeBaseProvider>
			</NavigationContainer>
		</AuthProvider>
	);
}
