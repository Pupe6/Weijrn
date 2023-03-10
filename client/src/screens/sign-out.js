// signout screen that give a modal box to confirm signout
// if pressed no then it will go back to the previous screen
// if pressed yes then it will signout the user and go to the login screen
// model is instantly opened when the screen is opened
// the modal is closed when the user presses no and the is still signed in and redirected to the previous screen
// the modal is closed and the user is signed out when the user presses yes

import React, { useContext } from "react";
import {
	Center,
	Button,
	Text,
	Modal,
	useDisclose,
	useToast,
} from "native-base";
import { AuthContext } from "../contexts/authContext";

export default function SignOutScreen(props) {
	const { isOpen, onOpen, onClose } = useDisclose({
		defaultIsOpen: true,
	});
	const { signOut } = useContext(AuthContext);
	const toast = useToast();

	return (
		<Center flex={1}>
			<Button onPress={onOpen}>Sign Out</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<Modal.Content>
					<Modal.CloseButton
						onPress={() => {
							onClose();
						}}
					/>
					{/* <Modal.Header>Sign</Modal.Header> */}
					<Modal.Body>
						<Text>Are you sure you want to sign out?</Text>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group variant="ghost" space={2}>
							<Button onPress={onClose}>No</Button>
							<Button
								onPress={async () => {
									await signOut().catch(alert);
									toast.show({
										title: "Signed out",
										status: "success",
									});
									props.navigation.navigate("Sign In");
								}}>
								Yes
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</Center>
	);
}

{
	/*
				<ModalContent>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Are you sure you want to sign out?</Text>
					</ModalBody>

					<ModalFooter>
						<Button.Group variant="ghost" space={2}>
							<Button onPress={onClose}>No</Button>
							<Button
								onPress={() => {
									signOut();
									toast.show({
										title: "Signed out",
										status: "success",
									});
									props.navigation.navigate("Sign In");
								}}>
								Yes
							</Button>
						</Button.Group>
					</ModalFooter>
				</ModalContent> */
}
