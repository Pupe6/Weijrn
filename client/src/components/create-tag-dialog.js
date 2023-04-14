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
import { createTag, statusUpdate } from "../services/tagService";

export default function CreateTagDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [tagNickname, setTagNickname] = useState("");
	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);
	const toast = useToast();
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();

	const [intervalId, setIntervalId] = useState(null);

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
								if (intervalId) {
									clearInterval(intervalId);
									setIntervalId(null);
								}
								onClose();
							}}
							ref={cancelRef}>
							Cancel
						</Button>
						<Button
							colorScheme="success"
							onPress={async () => {
								await createTag(tagNickname, user?.uuid).then(
									() => {
										if (!intervalId) {
											const id = setInterval(async () => {
												try {
													await statusUpdate(
														user?.uuid
													);

													if (!res.raspiSend.status) {
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
												} catch (err) {
													toast.show({
														title: "Error",
														description:
															err.message,
													});
												}
												toast.show({
													title: "Syncing tag",
													duration: 5000,
												});
											}, 2000);
											setIntervalId(id);
										}
									}
								);
							}}>
							Create
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
