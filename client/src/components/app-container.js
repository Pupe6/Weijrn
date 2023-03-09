import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import theme from "../theme";
import MyDrawer from "./navbar";
export default function AppContainer() {
	return (
		<NavigationContainer>
			<NativeBaseProvider theme={theme}>
				<MyDrawer />
			</NativeBaseProvider>
		</NavigationContainer>
	);
}
