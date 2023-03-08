import { extendTheme } from "native-base";

const config = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
