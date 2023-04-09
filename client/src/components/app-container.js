import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/authContext";
import { ThemeProvider } from "../contexts/themeContext";

export default function AppContainer({ children }) {
	global.refresh = 0;

	const linking = {
		prefixes: ["example://", /https?:\/\/(.+\.)?example\.com/],
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
