import React from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	useClipboard,
	HStack,
} from "native-base";
import { Entypo, Feather } from "@expo/vector-icons";
import { shareTag } from "../services/tagService";
import { AuthContext } from "../contexts/authContext";

export default function ShareTagDialog({ tag }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [shareCode, setShareCode] = React.useState("");

	const onClose = () => setIsOpen(false);

	const cancelRef = React.useRef(null);
	const toast = useToast();
	const { onCopy } = useClipboard();

	const { user } = React.useContext(AuthContext);

	return (
		<Center>
			<Button
				colorScheme="info"
				onPress={async () => {
					const res = await shareTag(tag.nickname, user.macAddress);

					setShareCode(res.shareCode);
					setIsOpen(!isOpen);
				}}>
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
						<HStack space={4} alignItems="center">
							<Text>
								Share this code with your friends to let them
								join your tag. This code will expire in 15
								minutes.
							</Text>
						</HStack>
						<HStack
							space={4}
							alignItems="center"
							justifyContent="center">
							<Text
								_dark={{
									color: "warmGray.50",
								}}
								_light={{
									color: "coolGray.800",
								}}
								fontSize="sm"
								fontWeight={600}>
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
						</HStack>
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
