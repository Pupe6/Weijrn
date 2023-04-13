import { useState, useRef, useContext } from "react";
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

export default function DeleteTagDialog({ tag }) {
	const [isOpen, setIsOpen] = useState(false);

	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);
	const { user, setUser } = useContext(AuthContext);
	const toast = useToast();
	const navigation = useNavigation();

	return (
		<Center>
			<Tooltip
				label={user?._id === tag._owner ? "Delete tag" : "Remove tag"}
				placement="top"
				accessibilityLabel={
					user?._id === tag._owner ? "Delete tag" : "Remove tag"
				}>
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
								{tag.nickname}
							</Text>
						</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<Text>
							Are you sure you want to{" "}
							{user?._id === tag._owner ? "delete" : "remove"}{" "}
							<Text bold italic>
								{tag.nickname}
							</Text>
							?
							{user?._id === tag._owner
								? " This will also delete all the data associated with this tag."
								: " This will remove the tag from your account."}
							{"\n\n"}
							<Text bold>This action cannot be undone.</Text>
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
								onPress={() => {
									deleteTag(tag.nickname, user?._token)
										.then(() => {
											toast.show({
												title: "Tag deleted",
											});
											onClose();
											navigation.navigate(
												"Control Panel",
												{
													refresh: ++global.refresh,
												}
											);
										})
										.catch(err => {
											if (
												err.message ===
												"Token is not valid."
											) {
												toast.show({
													title: "Session expired",
													description:
														"Please login again",
												});

												setUser(null);
											} else
												toast.show({
													title: "Error deleting tag",
													description: err.message,
												});
										});
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
