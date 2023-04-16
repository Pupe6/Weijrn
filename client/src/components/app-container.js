import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/authContext";
import { ThemeProvider } from "../contexts/themeContext";
import { LoadingProvider } from "../contexts/loadingContext";
import Loading from "./loading";

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
			<LoadingProvider>
				<ThemeProvider>
					<NavigationContainer
						linking={linking}
						fallback={<Loading />}>
						{children}
					</NavigationContainer>
				</ThemeProvider>
			</LoadingProvider>
		</AuthProvider>
	);
}
