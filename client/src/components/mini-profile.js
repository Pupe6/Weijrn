import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Box, Menu, useColorModeValue, Icon, ToastProvider } from "native-base";
import { Entypo } from "@expo/vector-icons";
import SignOut from "./sign-out";

export default function MiniProfile({ toast }) {
	const textColor = useColorModeValue("coolGray.800", "warmGray.50");
	const navigation = useNavigation();

	return (
		<ToastProvider>
			<Box safeArea>
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
						<SignOut toast={toast} />
					</Menu.Item>
				</Menu>
			</Box>
		</ToastProvider>
	);
}
