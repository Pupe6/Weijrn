import React from "react";
import {
	HStack,
	Text,
	Switch,
	useColorMode,
	Icon,
	useColorModeValue,
	Button,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggle() {
	const { toggleColorMode } = useColorMode();
	const color = useColorModeValue("gray.800", "white");
	const icon = useColorModeValue("moon", "sunny");
	return (
		<Button
			rounded="full"
			px="3"
			_active={{
				bg: "gray.300",
			}}
			position="absolute"
			top={5}
			right={5}
			onPress={toggleColorMode}>
			<Icon as={<Ionicons name={icon} />} size="sm" color={color} />
		</Button>
	);
}
