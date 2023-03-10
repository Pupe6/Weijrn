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
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { updateUser } from "../services/userService";

function validatePassword(password, confirmPassword) {
	return !!(password && confirmPassword);
}

export default function DeleteTagDialog() {
	const [isOpen, setIsOpen] = React.useState(false);
	const { user } = React.useContext(AuthContext);
	const [newUser, setNewUser] = React.useState({
		username: user.username,
		email: user.email,
		password: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const onClose = () => setIsOpen(false);
	const cancelRef = React.useRef(null);
	const toast = useToast();

	return (
		<Center>
			<Button colorScheme="amber" onPress={() => setIsOpen(!isOpen)}>
				<Text>Edit</Text>
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
								{user.username}
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
								onPress={async () => {
									const valid = validatePassword(
										newUser.newPassword,
										newUser.confirmNewPassword
									);
									if (!valid) {
										toast.show({
											title: "Password mismatch",
											status: "error",
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
									try {
										await updateUser(
											newUser,
											user._id,
											user._token
										);
										navigation.navigate("Home");
									} catch (error) {
										toast.show({
											title: "Error",
											status: "error",
											description: "Something went wrong",
										});
									}
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
