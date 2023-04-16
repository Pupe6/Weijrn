import { createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { extendTheme, NativeBaseProvider } from "native-base";

export const ThemeContext = createContext({
	theme: { colorMode: "light" },
	setTheme: () => {},
	outOfContext: true,
});

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useAsyncStorage("theme", { colorMode: "light" });

	const customTheme = extendTheme({
		config: {
			initialColorMode: theme.colorMode,
			useSystemColorMode: false,
		},
		breakpoints: {
			base: 0,
			sm: 480,
			md: 768,
			lg: 992,
			xl: 1280,
		},
	});

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<NativeBaseProvider theme={customTheme}>
				{children}
			</NativeBaseProvider>
		</ThemeContext.Provider>
	);
};
