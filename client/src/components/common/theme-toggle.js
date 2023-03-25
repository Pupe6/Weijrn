import React from "react";
import { useColorMode, Icon, useColorModeValue, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function ThemeToggle() {
	const { toggleColorMode } = useColorMode();
	const color = useColorModeValue("gray.800", "white");
	const icon = useColorModeValue("moon", "sunny");
	return (
		<Pressable onPress={toggleColorMode}>
			<Icon as={<Ionicons name={icon} />} size="md" color={color} />
		</Pressable>
	);
}
