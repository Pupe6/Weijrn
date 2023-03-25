import React from "react";
import { useColorMode, Icon, useColorModeValue, Button } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggle() {
	const { toggleColorMode } = useColorMode();
	const color = useColorModeValue("gray.800", "white");
	const icon = useColorModeValue("moon", "sunny");
	return (
		<Button
			position="absolute"
			top={5}
			right={5}
			shadow={2}
			onPress={toggleColorMode}
			variant="unstyled"
			bg="transparent">
			<Icon as={<Ionicons name={icon} />} size="sm" color={color} />
		</Button>
	);
}
