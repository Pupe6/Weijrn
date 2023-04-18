import { useContext } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
	Box,
	Pressable,
	VStack,
	Text,
	HStack,
	Divider,
	Icon,
	useColorModeValue,
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { getIcon } from "../utils/getIcon";

export default function CustomDrawerContent(props) {
	const { user } = useContext(AuthContext);
	// rgba(75,85,99,255) is coolGray.600
	const textColors = {
		light: "rgba(75,85,99,255)",
		dark: "rgb(255, 255, 255)",
	};
	const textColor = useColorModeValue(textColors.light, textColors.dark);

	return (
		<DrawerContentScrollView {...props} safeArea>
			<VStack space="6" my="2" mx="1">
				<Box px="4">
					<Text bold color={textColor}>
						Account
					</Text>
					<Text
						fontSize="14"
						mt="1"
						fontWeight="500"
						color={textColor}>
						{user?.email ? user?.email : "Not signed in"}
					</Text>
					{/* Add a close button for web */}
					<Pressable
						onPress={() => props.navigation.closeDrawer()}
						position="absolute"
						right="3"
						top="3"
						rounded="full"
						p="2"
						display="none"
						_web={{
							display: "flex",
						}}
						style={{
							transition: "all 0.2s ease-in-out",
						}}
						_hover={{
							bg:
								textColor === textColors.light
									? "rgba(75, 85, 99, 0.5)"
									: "rgba(255, 255, 255, 0.5)",
						}}
						bg={
							textColor === textColors.light
								? "rgba(75, 85, 99, 0.2)"
								: "rgba(255, 255, 255, 0.2)"
						}>
						<Icon
							color={textColor}
							size="5"
							as={<MaterialCommunityIcons name="close" />}
						/>
					</Pressable>
				</Box>
				<VStack divider={<Divider />} space="4">
					<VStack space="3">
						{props.state.routeNames.map((name, index) => (
							<Pressable
								px="5"
								py="3"
								rounded="md"
								bg={
									index === props.state.index
										? "rgba(6, 182, 212, 0.1)"
										: "transparent"
								}
								key={index}
								onPress={event => {
									props.navigation.navigate(name);
								}}>
								<HStack space="7" alignItems="center">
									<Icon
										color={
											index === props.state.index
												? "primary.500"
												: textColor
										}
										size="5"
										as={
											<MaterialCommunityIcons
												name={getIcon(name)}
											/>
										}
									/>
									<Text
										fontWeight="500"
										color={
											index === props.state.index
												? "primary.500"
												: textColor
										}>
										{name}
									</Text>
								</HStack>
							</Pressable>
						))}
					</VStack>
				</VStack>
			</VStack>
		</DrawerContentScrollView>
	);
}
