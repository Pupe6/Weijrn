import * as React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "../contexts/authContext";
import theme from "../theme";
import { ThemeToggle } from "./common/theme-toggle";
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
