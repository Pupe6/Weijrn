import { useState, useRef, useContext } from "react";
import {
	AlertDialog,
	Button,
	Center,
	useToast,
	Icon,
	Text,
	FormControl,
	Input,
	Tooltip,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/authContext";
import { getSharedTag } from "../services/tagService";
import { useNavigation } from "@react-navigation/native";

export default function GetSharedTagDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [shareCode, setShareCode] = useState("");
	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);
	const toast = useToast();
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();

	return (
		<Center>
			<Tooltip
				label="Import tag"
				placement="top"
				accessibilityLabel="Import tag">
				<Button colorScheme="info" onPress={() => setIsOpen(!isOpen)}>
					<Icon
						as={<MaterialIcons name="get-app" />}
						size="lg"
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
						<Text>Import Tag</Text>
					</AlertDialog.Header>
					<AlertDialog.Body>
						<FormControl>
							<FormControl.Label>Code</FormControl.Label>
							<Input
								placeholder="Enter code"
								_light={{
									placeholderTextColor: "blueGray.400",
								}}
								_dark={{
									placeholderTextColor: "blueGray.50",
								}}
								onChangeText={text => setShareCode(text)}
							/>
						</FormControl>
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button
							variant="unstyled"
							colorScheme="coolGray"
							onPress={onClose}
							ref={cancelRef}>
							Cancel
						</Button>
						<Button
							colorScheme="info"
							onPress={async () => {
								try {
									await getSharedTag(shareCode, user?.uuid);

									toast.show({
										avoidKeyboard: true,
										title: "Tag imported successfully",
									});

									onClose();

									navigation.navigate("Control Panel", {
										refresh: ++global.refresh,
									});
								} catch (error) {
									toast.show({
										avoidKeyboard: true,
										title: "Error",
										description: error.message,
										status: "error",
									});
								}
							}}>
							Import
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
