import { useState, useRef, useContext } from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	useClipboard,
	HStack,
	Tooltip,
} from "native-base";
import { Entypo, Feather } from "@expo/vector-icons";
import { shareTag } from "../services/tagService";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";

export default function ShareTagDialog({ tag }) {
	const [isOpen, setIsOpen] = useState(false);
	const [shareCode, setShareCode] = useState("");

	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);

	const toast = useToast();

	const { onCopy } = useClipboard();

	const { user } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	return (
		<Center>
			<Tooltip
				label="Share tag"
				placement="top"
				accessibilityLabel="Share tag">
				<Button
					colorScheme="info"
					onPress={() => {
						setLoading(true);

						shareTag(tag._id, user?.uuid)
							.then(({ shareCode }) => {
								setLoading(false);

								setShareCode(shareCode);

								setIsOpen(true);

								toast.show({
									avoidKeyboard: true,
									title: "Share code generated",
								});
							})
							.catch(err => {
								setLoading(false);

								toast.show({
									avoidKeyboard: true,
									title: "Error generating share code",
									description: err.message,
								});
							});
					}}>
					<Icon
						as={<Entypo name="share" />}
						size="sm"
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
										avoidKeyboard: true,
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
