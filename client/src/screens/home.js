import * as react from "react";
import { Text, Box, Center, VStack } from "native-base";
import ThemeToggle from "../components/common/theme-toggle";

export default function MainScreen() {
	return (
		<Center
			flex={1}
			_dark={{ bg: "blueGray.900" }}
			_light={{ bg: "blueGray.50" }}
			px="3">
			<VStack space={2} alignItems="center">
				<Text fontSize="4xl">Welcome to Weijrn!</Text>
				<Text fontSize="lg">This is the main screen.</Text>
				<ThemeToggle />
			</VStack>
		</Center>
	);
}
