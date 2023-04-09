import React, { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { AlertDialog, Button, Center, useToast } from "native-base";

export default function SignOut() {
	const [isOpen, setIsOpen] = React.useState(false);

	const onClose = () => {
		setIsOpen(false);
	};

	const cancelRef = React.useRef(null);
	const { logout, user } = useContext(AuthContext);
	const toast = useToast();

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
								onPress={async () => {
									onClose();
									toast.show({
										title: "Signed out",
										description: "You have been signed out",
										status: "success",
										duration: 3000,
										isClosable: true,
									});
									await logout(user._token);
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
