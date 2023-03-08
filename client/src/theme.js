import { extendTheme } from "native-base";

const config = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const breakpoints = {
	base: 0,
	sm: 480,
	md: 768,
	lg: 992,
	xl: 1280,
};

const theme = extendTheme({ config, breakpoints });

export default theme;
