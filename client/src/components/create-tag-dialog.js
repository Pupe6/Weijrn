import { useState, useRef, useContext, useEffect } from "react";
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
import {
	createTag,
	statusUpdate,
	resolveStatusUpdate,
} from "../services/tagService";

export default function CreateTagDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [tagNickname, setTagNickname] = useState("");
	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);
	const toast = useToast();
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();

	useEffect(() => {
		return () => resolveStatusUpdate(user?.uuid);
	}, []);

	const intervalRef = useRef(null);

	return (
		<Center>
			<Tooltip
				label="Create tag"
				placement="top"
				accessibilityLabel="Create tag">
				<Button
					w={12}
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
							onPress={async () => {
								if (intervalRef.current) {
									clearInterval(intervalRef.current);
									intervalRef.current = null;

									await resolveStatusUpdate(user?.uuid).then(
										() => {
											toast.closeAll();
										}
									);
								}

								onClose();
							}}
							ref={cancelRef}>
							Cancel
						</Button>
						<Button
							colorScheme="success"
							onPress={async () => {
								await createTag(tagNickname, user?.uuid)
									.then(() => {
										if (!intervalRef.current) {
											intervalRef.current = setInterval(
												() => {
													statusUpdate(user?.uuid)
														.then(res => {
															if (
																!res.raspiSend
																	.status
															) {
																toast.show({
																	avoidKeyboard: true,
																	title: "Tag synced",
																});

																clearInterval(
																	intervalRef.current
																);
																intervalRef.current =
																	null;

																toast.closeAll();

																onClose();

																navigation.navigate(
																	"Control Panel"
																);
															}
														})
														.catch(err => {
															toast.show({
																avoidKeyboard: true,
																title: "Error getting status update",
																description:
																	err.message,
															});

															clearInterval(
																intervalRef.current
															);

															intervalRef.current =
																null;
														});
												},
												2000
											);

											toast.show({
												avoidKeyboard: true,
												title: "Syncing tag",
												duration: null,
											});
										} else {
											toast.show({
												avoidKeyboard: true,
												title: "Tag already syncing, please wait",
											});
										}
									})
									.catch(err => {
										toast.show({
											avoidKeyboard: true,
											title: "Error creating tag",
											description: err.message,
										});
									});
							}}>
							Create
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
