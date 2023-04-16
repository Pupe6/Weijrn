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
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { updateUser } from "../services/userService";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LoadingContext } from "../contexts/loadingContext";

function validatePassword(password, confirmPassword) {
	if (!password && !confirmPassword) return true;

	return !!(password && confirmPassword);
}

export default function EditUserDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		username: "",
		email: "",
		password: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const onClose = () => setIsOpen(false);

	const navigation = useNavigation();

	const cancelRef = useRef(null);

	const { user, setUser } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	const toast = useToast();

	useEffect(() => {
		setNewUser({
			username: user?.username,
			email: user?.email,
			password: "",
			newPassword: "",
			confirmNewPassword: "",
		});
	}, [user, isOpen]);

	return (
		<Center>
			<Button colorScheme="amber" onPress={() => setIsOpen(!isOpen)}>
				<Icon
					as={<AntDesign name="edit" size={24} color="black" />}
					size="sm"
					color="white"
				/>
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
							Edit User{" "}
							<Text bold italic>
								{user?.username}
							</Text>
						</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<FormControl>
							<FormControl.Label>Username</FormControl.Label>
							<Input
								value={newUser.username}
								onChangeText={text =>
									setNewUser({
										...newUser,
										username: text,
									})
								}
							/>
						</FormControl>
						<FormControl>
							<FormControl.Label>Email</FormControl.Label>
							<Input
								value={newUser.email}
								onChangeText={text =>
									setNewUser({
										...newUser,
										email: text,
									})
								}
							/>
						</FormControl>
						<FormControl>
							<FormControl.Label>Old Password</FormControl.Label>
							<Input
								type="password"
								value={newUser.password}
								onChangeText={text =>
									setNewUser({
										...newUser,
										password: text,
									})
								}
							/>
						</FormControl>
						<FormControl>
							<FormControl.Label>New Password</FormControl.Label>
							<Input
								type="password"
								value={newUser.newPassword}
								onChangeText={text =>
									setNewUser({
										...newUser,
										newPassword: text,
									})
								}
							/>
						</FormControl>
						<FormControl>
							<FormControl.Label>
								Confirm New Password
							</FormControl.Label>
							<Input
								type="password"
								value={newUser.confirmNewPassword}
								onChangeText={text =>
									setNewUser({
										...newUser,
										confirmNewPassword: text,
									})
								}
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
								colorScheme="amber"
								onPress={() => {
									const valid = validatePassword(
										newUser.newPassword,
										newUser.confirmNewPassword
									);

									if (!valid) {
										toast.show({
											avoidKeyboard: true,
											title: "Password mismatch",
											description:
												"Please check your passwords",
										});
										setNewUser({
											...newUser,
											newPassword: undefined,
											confirmNewPassword: undefined,
										});
										return;
									}

									onClose();

									setLoading(true);

									updateUser(newUser, user?._id, user?._token)
										.then(updatedUser => {
											setLoading(false);

											setUser(updatedUser);

											toast.show({
												avoidKeyboard: true,
												title: "User successfully updated",
											});

											navigation.navigate("Profile");
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
													title: "Error updating user",
													description: err.message,
												});

											setLoading(false);
										});
								}}>
								Edit
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
