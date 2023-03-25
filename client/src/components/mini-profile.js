// simple profile component that with avatar and dropdown with sign out and profile button

import {
	Box,
	Button,
	Center,
	HStack,
	Menu,
	Text,
	useColorModeValue,
	VStack,
	Icon,
} from "native-base";
import { Pressable } from "react-native";

import { Entypo } from "@expo/vector-icons";
import SignOut from "./sign-out";
import { useNavigation } from "@react-navigation/native";

export default function MiniProfile() {
	const textColor = useColorModeValue("coolGray.800", "warmGray.50");
	const navigation = useNavigation();

	return (
		<Box flex="1" safeArea>
			<Menu
				closeOnSelect
				trigger={triggerProps => (
					<Pressable
						{...triggerProps}
						accessibilityRole="button"
						accessibilityLabel="Open Menu">
						<Icon
							as={<Entypo name="user" />}
							size="md"
							color={textColor}
						/>
					</Pressable>
				)}>
				<Menu.Item onPress={() => navigation.navigate("Profile")}>
					Profile
				</Menu.Item>
				<Menu.Item>
					<SignOut />
				</Menu.Item>
			</Menu>
		</Box>
	);
}
