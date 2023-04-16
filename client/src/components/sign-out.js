import { useState, useRef, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { AlertDialog, Button, Center } from "native-base";
import { LoadingContext } from "../contexts/loadingContext";

export default function SignOut({ toast }) {
	const [isOpen, setIsOpen] = useState(false);

	const onClose = () => {
		setIsOpen(false);
	};

	const cancelRef = useRef(null);

	const { logout, user } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	return (
		<Center>
			<AlertDialog
				leastDestructiveRef={cancelRef}
				isOpen={isOpen}
				onClose={onClose}
				motionPreset="slideInBottom"
				onOverlayClick={onClose}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton
						onPress={() => {
							onClose();
						}}
					/>
					<AlertDialog.Header>Sign Out</AlertDialog.Header>
					<AlertDialog.Body>
						Are you sure you want to sign out?
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
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
								colorScheme="danger"
								onPress={() => {
									setLoading(true);

									onClose();

									logout(user?._token)
										.then(() => {
											toast.show({
												avoidKeyboard: true,
												title: "Signed out",
												description:
													"You have been signed out",
											});

											setLoading(false);
										})
										.catch(err => {
											toast.show({
												avoidKeyboard: true,
												title: "Error",
												description: err.message,
											});
										});
								}}>
								Sign Out
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
			<Button
				colorScheme="danger"
				onPress={() => {
					setIsOpen(!isOpen);
				}}>
				Sign Out
			</Button>
		</Center>
	);
}
