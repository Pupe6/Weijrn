import { useState, useRef, useContext } from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	FormControl,
	Input,
	Tooltip,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../contexts/authContext";
import { useNavigation } from "@react-navigation/native";

import { updateTag } from "../services/tagService";

export default function EditTagDialog(props) {
	const [isOpen, setIsOpen] = useState(false);
	const [nickname, setNickname] = useState(props.tag.nickname);
	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);
	const toast = useToast();
	const { user, setUser } = useContext(AuthContext);
	const navigation = useNavigation();

	return (
		user?._id === props.tag._owner && (
			<Center>
				<Tooltip
					label="Edit tag"
					placement="top"
					accessibilityLabel="Edit tag">
					<Button
						colorScheme="amber"
						onPress={() => setIsOpen(!isOpen)}>
						<Icon
							as={
								<AntDesign
									name="edit"
									size={24}
									color="black"
								/>
							}
							size="sm"
							color="white"
						/>
					</Button>
				</Tooltip>
				<AlertDialog
					leastDestructiveRef={cancelRef}
					isOpen={isOpen}
					onClose={onClose}
					motionPreset="slideInBottom">
					<AlertDialog.Content>
						<AlertDialog.CloseButton />
						<AlertDialog.Header>
							<Text>Edit Tag</Text>
						</AlertDialog.Header>
						<AlertDialog.Body>
							<FormControl>
								<FormControl.Label>
									New Nickname
								</FormControl.Label>
								<Input
									placeholder="Enter nickname"
									value={nickname}
									_light={{
										placeholderTextColor: "blueGray.400",
									}}
									_dark={{
										placeholderTextColor: "blueGray.50",
									}}
									onChangeText={text => setNickname(text)}
								/>
							</FormControl>
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button
								variant="unstyled"
								colorScheme="coolGray"
								onPress={() => {
									setNickname(props.tag.nickname);
									onClose();
								}}
								ref={cancelRef}>
								Cancel
							</Button>
							<Button
								colorScheme="amber"
								onPress={async () => {
									updateTag(
										props.tag._id,
										user?._token,
										nickname
									)
										.then(() => {
											toast.show({
												avoidKeyboard: true,
												title: "Tag updated",
											});
											onClose();
											navigation.navigate(
												"Control Panel",
												{
													refresh: ++global.refresh,
												}
											);
										})
										.catch(err => {
											if (
												err.message ===
												"Token is not valid."
											) {
												toast.show({
													avoidKeyboard: true,
													title: "Session expired",
													description:
														"Please log in again.",
												});

												setUser(null);
											} else
												toast.show({
													avoidKeyboard: true,
													title: "Error updating tag",
													description: err.message,
												});
										});
								}}>
								Edit
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog>
			</Center>
		)
	);
}
