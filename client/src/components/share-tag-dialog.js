import React from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	useClipboard,
} from "native-base";
import { Entypo, Feather } from "@expo/vector-icons";
import { shareTag } from "../services/tagService";

export default function ShareTagDialog({ shareCode }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const onClose = () => setIsOpen(false);

	const cancelRef = React.useRef(null);
	const toast = useToast();
	const { onCopy } = useClipboard();

	return (
		<Center>
			<Button colorScheme="info" onPress={() => setIsOpen(!isOpen)}>
				<Icon as={<Entypo name="share" />} size="sm" color="white" />
			</Button>
			<AlertDialog
				leastDestructiveRef={cancelRef}
				isOpen={isOpen}
				onClose={onClose}
				motionPreset="slideInBottom">
				<AlertDialog.Content>
					<AlertDialog.CloseButton />
					<AlertDialog.Header>
						<Text>Share Code</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<Text>
							Share this code with your friends to let them join
							your tag. This code will expire in 15 minutes.
						</Text>
						<Text bold italic>
							{shareCode}
						</Text>
						<Button
							onPress={() => {
								onCopy(shareCode);
								toast.show({
									title: "Copied to clipboard",
								});
							}}
							variant="unstyled"
							_text={{
								color: "blue.500",
							}}>
							<Icon as={<Feather name="copy" />} size="sm" />
						</Button>
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button colorScheme="info" onPress={onClose}>
							Done
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
