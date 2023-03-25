import { useContext } from "react";
import { ThemeContext } from "../../contexts/themeContext";
import { useColorMode, Icon, useColorModeValue } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function ThemeToggle() {
	const { colorMode, toggleColorMode } = useColorMode();
	const color = useColorModeValue("gray.800", "white");
	const icon = useColorModeValue("moon", "sunny");
	const { setTheme } = useContext(ThemeContext);
	return (
		<Pressable
			onPress={() => {
				toggleColorMode();
				setTheme(colorMode);
			}}>
			<Icon as={<Ionicons name={icon} />} size="md" color={color} />
		</Pressable>
	);
}
