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
} from "native-base";
import { Entypo } from "@expo/vector-icons";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";
import { deleteUser } from "../services/userService";

export default function DeleteTagDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");

	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);

	const { user, setUser } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	const toast = useToast();

	return (
		<Center>
			<Button colorScheme="danger" onPress={() => setIsOpen(!isOpen)}>
				<Icon as={<Entypo name="trash" />} size="sm" color="white" />
			</Button>
			<AlertDialog
				leastDestructiveRef={cancelRef}
				isOpen={isOpen}
				onClose={onClose}
				motionPreset="slideInBottom">
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>
						<Text>
							Delete User{" "}
							<Text bold italic>
								{user?.username}
							</Text>
						</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<Text>
							This will remove the user{" "}
							<Text bold italic>
								{user?.username}.
							</Text>
							This action cannot be reversed. Deleted data can not
							be recovered.
						</Text>
						<FormControl>
							<FormControl.Label>
								Confirm Password
							</FormControl.Label>
							<Input
								type="password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
							/>
						</FormControl>
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button
								variant="unstyled"
								colorScheme="coolGray"
								onPress={onClose}
								ref={cancelRef}>
								Cancel
							</Button>
							<Button
								colorScheme="danger"
								onPress={() => {
									onClose();

									setLoading(true);

									deleteUser(
										user?._id,
										user?._token,
										confirmPassword
									)
										.then(() => {
											setLoading(false);

											setUser(null);

											toast.show({
												avoidKeyboard: true,
												title: "User deleted.",
											});
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
													title: "Error deleting user.",
													description: err.message,
												});

											setLoading(false);
										});
								}}>
								Delete
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
