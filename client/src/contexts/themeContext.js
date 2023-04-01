import { useEffect, useState, createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { extendTheme, NativeBaseProvider } from "native-base";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useAsyncStorage("theme", "dark");

	const [customTheme, setCustomTheme] = useState(
		extendTheme({
			config: {
				initialColorMode: theme,
				useSystemColorMode: false,
			},
			breakpoints: {
				base: 0,
				sm: 480,
				md: 768,
				lg: 992,
				xl: 1280,
			},
		})
	);

	useEffect(() => {
		console.log(`Theme changed to ${theme}`);

		setCustomTheme(
			extendTheme({
				config: {
					initialColorMode: theme,
					useSystemColorMode: false,
				},
				breakpoints: {
					base: 0,
					sm: 480,
					md: 768,
					lg: 992,
					xl: 1280,
				},
			})
		);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<NativeBaseProvider theme={customTheme}>
				{children}
			</NativeBaseProvider>
		</ThemeContext.Provider>
	);
};
