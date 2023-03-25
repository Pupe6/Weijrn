import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/authContext";
import { ThemeProvider } from "../contexts/themeContext";

export default function AppContainer({ children }) {
	global.refresh = 0;

	return (
		<ThemeProvider>
			<AuthProvider>
				<NavigationContainer>{children}</NavigationContainer>
			</AuthProvider>
		</ThemeProvider>
	);
}
