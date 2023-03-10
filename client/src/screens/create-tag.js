// create a tag that utilizes the createTag in tagContext
// a minimalistic cool looking create tag screen
// on creation there should be a toast that says syncing tag and then sends you to the control panel screen with the toast changing to tag synced

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
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { createTag, statusUpdate } from "../services/tagService";

export default function CreateTagScreen(props) {
	const [tag, setTag] = useState({
		nickname: "",
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
					Create Tag
				</Heading>
				<ScrollView showsVerticalScrollIndicator={false}>
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
							createTag(tag.nickname)
								.then(() => {
									toast.show({
										title: "Syncing tag",
										status: "warning",
									});
									const repeatInterval = setInterval(() => {
										statusUpdate()
											.then(res => {
												if (!res.raspiSend.status) {
													toast.show({
														title: "Tag synced",
														status: "success",
													});

													props.navigation.navigate(
														"Control Panel"
													);

													clearInterval(
														repeatInterval
													);
												}
											})
											.catch(alert);
									}, 2000);
								})
								.catch(alert);
						}}>
						Create Tag
					</Button>
				</ScrollView>
			</Box>
		</Center>
	);
}
