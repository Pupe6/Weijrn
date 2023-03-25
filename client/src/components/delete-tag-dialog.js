import React from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	Tooltip,
} from "native-base";
import { AuthContext } from "../contexts/authContext";
import { deleteTag } from "../services/tagService";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

export default function DeleteTagDialog({ nickname }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const onClose = () => setIsOpen(false);

	const cancelRef = React.useRef(null);
	const { user } = React.useContext(AuthContext);
	const toast = useToast();
	const navigation = useNavigation();

	return (
		<Center>
			<Tooltip
				label="Delete tag"
				placement="top"
				accessibilityLabel="Delete tag">
				<Button colorScheme="danger" onPress={() => setIsOpen(!isOpen)}>
					<Icon
						as={<Entypo name="trash" />}
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
						<Text>
							Delete Tag{" "}
							<Text bold italic>
								{nickname}
							</Text>
						</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<Text>
							This will remove the tag relating to relating to the
							user{" "}
							<Text bold italic>
								{user.username}
							</Text>
							. This action cannot be reversed. Deleted data can
							not be recovered.
						</Text>
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
								onPress={async () => {
									await deleteTag(nickname, user._token)
										.then(() => {
											toast.show({
												title: "Tag deleted",
												status: "success",
											});
											onClose();
											navigation.navigate(
												"Control Panel",
												{
													refresh: ++global.refresh,
												}
											);
										})
										.catch(alert);
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
