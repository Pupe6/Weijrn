import React, { useContext, useState } from "react";
import {
	Box,
	Button,
	Center,
	Heading,
	HStack,
	Icon,
	Text,
	VStack,
	useColorModeValue,
	Tooltip,
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { Feather } from "@expo/vector-icons";

import EditUserDialog from "../components/edit-user-dialog";
import DeleteUserDialog from "../components/delete-user-dialog";

export default function ProfileScreen({ navigation }) {
	const [showUUID, setShowUUID] = useState(false);

	const { user } = useContext(AuthContext);

	return (
		<Box
			flex="1"
			safeAreaTop
			_dark={{
				bg: "coolGray.800",
			}}
			_light={{
				bg: "white",
			}}
			w="100%">
			<Center>
				<Box
					_dark={{
						bg: "coolGray.800",
					}}
					_light={{
						bg: "white",
					}}
					rounded="lg"
					flex="1"
					safeAreaTop
					maxW="400px"
					w="100%"
					alignItems="center">
					<Heading p="4" pb="3" size="lg">
						Profile
					</Heading>
					<VStack space={4} p="4">
						<HStack space={4} alignItems="center">
							<Icon
								as={<Feather name="user" />}
								size="sm"
								color={useColorModeValue(
									"coolGray.800",
									"white"
								)}
							/>
							<Text
								_dark={{
									color: "warmGray.50",
								}}
								_light={{
									color: "coolGray.800",
								}}
								fontSize="sm"
								fontWeight={600}>
								{user?.username}
							</Text>
						</HStack>
						<HStack space={4} alignItems="center">
							<Icon
								as={<Feather name="mail" />}
								size="sm"
								color={useColorModeValue(
									"coolGray.800",
									"white"
								)}
							/>
							<Text
								_dark={{
									color: "warmGray.50",
								}}
								_light={{
									color: "coolGray.800",
								}}
								fontSize="sm"
								fontWeight={600}>
								{user?.email}
							</Text>
						</HStack>
						<HStack space={4} alignItems="center">
							<Icon
								as={<Feather name="key" />}
								size="sm"
								color={useColorModeValue(
									"coolGray.800",
									"white"
								)}
							/>
							{showUUID ? (
								<>
									<Text
										_dark={{
											color: "warmGray.50",
										}}
										_light={{
											color: "coolGray.800",
										}}
										fontSize="sm"
										fontWeight={600}>
										{user?.uuid}
									</Text>
									<Tooltip
										label="Hide UUID"
										placement="top"
										accessibilityLabel="Hide UUID">
										<Button
											_dark={{
												bg: "coolGray.800",
											}}
											_light={{
												bg: "white",
											}}
											rounded="full"
											size="sm"
											onPress={() => setShowUUID(false)}>
											<Icon
												as={<Feather name="eye-off" />}
												size="sm"
												color={useColorModeValue(
													"coolGray.800",
													"white"
												)}
											/>
										</Button>
									</Tooltip>
								</>
							) : (
								<>
									<Text
										_dark={{
											color: "warmGray.50",
										}}
										_light={{
											color: "coolGray.800",
										}}
										fontWeight={600}>
										{"  "}***-***-***-***{"  "}
									</Text>
									<Tooltip
										label="Show UUID"
										placement="top"
										accessibilityLabel="Show UUID">
										<Button
											_dark={{
												bg: "coolGray.800",
											}}
											_light={{
												bg: "white",
											}}
											rounded="full"
											size="sm"
											onPress={() => setShowUUID(true)}>
											<Icon
												as={<Feather name="eye" />}
												size="sm"
												color={useColorModeValue(
													"coolGray.800",
													"white"
												)}
											/>
										</Button>
									</Tooltip>
								</>
							)}
						</HStack>
						<HStack
							space={4}
							alignItems="center"
							justifyContent="center">
							<EditUserDialog />
							<DeleteUserDialog />
						</HStack>
					</VStack>
				</Box>
			</Center>
		</Box>
	);
}
