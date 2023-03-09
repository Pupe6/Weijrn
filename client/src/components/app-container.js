import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import theme from "../theme";
import { AuthProvider } from "../contexts/authContext";

export default function AppContainer({ children }) {
	return (
		<NavigationContainer>
			<AuthProvider>
				<NativeBaseProvider theme={theme}>
					{children}
				</NativeBaseProvider>
			</AuthProvider>
		</NavigationContainer>
	);
}
