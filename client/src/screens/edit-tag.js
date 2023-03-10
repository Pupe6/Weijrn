import React, { useState, useContext } from "react";
import {
	Box,
	Button,
	Center,
	FormControl,
	Input,
	ScrollView,
	useToast,
	Heading,
	HStack,
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { updateTag } from "../services/tagService";

export default function EditTagScreen(props) {
	const [tag, setTag] = useState({
		oldNickname: props?.route?.params?.tag?.nickname || "",
		nickname: props?.route?.params?.tag?.nickname,
	});
	const toast = useToast();
	const { user } = useContext(AuthContext);

	return (
		<Center h="290px">
			<Box
				_dark={{
					bg: "coolGray.800",
				}}
				_light={{
					bg: "white",
				}}
				flex="1"
				safeAreaTop
				maxW="400px"
				w="100%">
				<Heading p="4" pb="3" size="lg">
					Edit Tag
				</Heading>

				<ScrollView showsVerticalScrollIndicator={false}>
					{!props?.route?.params?.tag?.nickname ? (
						<FormControl>
							<FormControl.Label
								_text={{
									color: "coolGray.800",
									fontSize: "sm",
									fontWeight: 600,
								}}>
								Nickname
							</FormControl.Label>
							<Input
								onChangeText={text =>
									setTag({ ...tag, oldNickname: text })
								}
								value={tag.oldNickname}
								placeholder="Enter Old Nickname"
							/>
						</FormControl>
					) : (
						<></>
					)}
					<FormControl>
						<FormControl.Label
							_text={{
								color: "coolGray.800",
								fontSize: "sm",
								fontWeight: 600,
							}}>
							Nickname
						</FormControl.Label>
						<Input
							onChangeText={text =>
								setTag({ ...tag, nickname: text })
							}
							value={tag.nickname}
							placeholder="Enter nickname"
						/>
					</FormControl>
					<Button
						mt="2"
						colorScheme="cyan"
						_text={{
							color: "white",
						}}
						onPress={() => {
							updateTag(
								tag.oldNickname,
								user._token,
								tag.nickname
							)
								.then(() => {
									toast.show({
										title: "Tag updated",
										status: "success",
									});
									props.navigation.navigate("Control Panel", {
										refresh: true,
									});
								})
								.catch(alert);
						}}>
						Edit Tag
					</Button>
				</ScrollView>
			</Box>
		</Center>
	);
}
