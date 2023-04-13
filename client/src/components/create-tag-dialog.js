import React from "react";
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
import { createTag, statusUpdate } from "../services/tagService";

export default function CreateTagDialog() {
	const [isOpen, setIsOpen] = React.useState(false);
	const [tagNickname, setTagNickname] = React.useState("");
	const onClose = () => setIsOpen(false);

	const cancelRef = React.useRef(null);
	const toast = useToast();
	const { user } = React.useContext(AuthContext);
	const navigation = useNavigation();

	return (
		<Center>
			<Tooltip
				label="Create tag"
				placement="top"
				accessibilityLabel="Create tag">
				<Button
					colorScheme="success"
					onPress={() => setIsOpen(!isOpen)}>
					<Icon
						as={<AntDesign name="pluscircleo" size={24} />}
						size="lg"
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
						<Text>Create Tag</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<FormControl>
							<FormControl.Label>Tag</FormControl.Label>
							<Input
								placeholder="Enter nickname"
								_light={{
									placeholderTextColor: "blueGray.400",
								}}
								_dark={{
									placeholderTextColor: "blueGray.50",
								}}
								onChangeText={text => setTagNickname(text)}
							/>
						</FormControl>
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button
							variant="unstyled"
							colorScheme="coolGray"
							onPress={() => {
								onClose();
							}}
							ref={cancelRef}>
							Cancel
						</Button>
						<Button
							colorScheme="success"
							onPress={async () => {
								createTag(
									tagNickname,
									user?._id,
									user?.macAddress
								)
									.then(() => {
										toast.show({
											title: "Syncing tag",
										});
										const repeatInterval = setInterval(
											() => {
												statusUpdate(user?.macAddress)
													.then(res => {
														if (
															!res.raspiSend
																.status
														) {
															toast.show({
																title: "Tag synced",
															});

															navigation.navigate(
																"Control Panel"
															);

															clearInterval(
																repeatInterval
															);

															onClose();
														}
													})
													.catch(alert);
											},
											2000
										);
									})
									.catch(alert);
							}}>
							Create
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
