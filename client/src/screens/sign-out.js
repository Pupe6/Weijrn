import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import { AlertDialog, Button, Center } from "native-base";

export default function SignOutScreen({ navigation }) {
	useEffect(() => {
		setIsOpen(prev => !prev);
	}, []);

	const [isOpen, setIsOpen] = React.useState(false);

	const onClose = () => {
		setIsOpen(false);
		navigation.goBack();
	};

	const cancelRef = React.useRef(null);
	const { logout, user } = useContext(AuthContext);

	return (
		<Center>
			<AlertDialog
				leastDestructiveRef={cancelRef}
				isOpen={isOpen}
				onClose={onClose}>
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
									onClose();
									logout(user._token);
								}}>
								Sign Out
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
