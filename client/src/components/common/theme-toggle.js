import { useContext } from "react";
import { useColorMode, Icon, useColorModeValue } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { ThemeContext } from "../../contexts/themeContext";

export default function ThemeToggle() {
	const { colorMode, toggleColorMode } = useColorMode();
	const color = useColorModeValue("gray.800", "white");
	const icon = useColorModeValue("moon", "sunny");

	const { theme, setTheme } = useContext(ThemeContext);

	const handleThemeChange = () => {
		toggleColorMode();
		setTheme(colorMode);
	};

	return (
		<Pressable onPress={handleThemeChange}>
			<Icon as={<Ionicons name={icon} />} size="md" color={color} />
		</Pressable>
	);
}
