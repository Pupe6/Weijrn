import * as React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "../contexts/authContext";
import theme from "../theme";
import MyDrawer from "./navbar";
export default function AppContainer() {
	return (
		<AuthProvider>
			<NativeBaseProvider theme={theme}>
				<MyDrawer />
			</NativeBaseProvider>
		</AuthProvider>
	);
}
