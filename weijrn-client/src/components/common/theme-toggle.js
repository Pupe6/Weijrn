import React from "react";
import { HStack, Text, Switch, useColorMode } from "native-base";

export default function ThemeToggle() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<HStack alignItems="center">
			<Text>Dark</Text>
			<Switch
				isChecked={colorMode === "light"}
				onToggle={toggleColorMode}
			/>
			<Text>Light</Text>
		</HStack>
	);
}
