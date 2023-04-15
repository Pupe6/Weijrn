import { NavigationContainer } from "@react-navigation/native";
import { Text } from "native-base";
import { AuthProvider } from "../contexts/authContext";
import { ThemeProvider } from "../contexts/themeContext";

export default function AppContainer({ children }) {
	global.refresh = 0;

	const linking = {
		config: {
			screens: {
				"Control Panel": "",
				"Sign In": "sign-in",
				"Sign Up": "sign-up",
				"Profile": "profile",
			},
		},
	};

	return (
		<AuthProvider>
			<ThemeProvider>
				<NavigationContainer
					linking={linking}
					fallback={<Text>Loading...</Text>}>
					{children}
				</NavigationContainer>
			</ThemeProvider>
		</AuthProvider>
	);
}
