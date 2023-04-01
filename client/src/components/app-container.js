import * as React from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/authContext";
import theme from "../theme";

export default function AppContainer({ children }) {
	global.refresh = 0;

	return (
		<AuthProvider>
			<NavigationContainer>
				<NativeBaseProvider theme={theme}>
					{children}
				</NativeBaseProvider>
			</NavigationContainer>
		</AuthProvider>
	);
}
