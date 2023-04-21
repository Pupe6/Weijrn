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
	KeyboardAvoidingView,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";
import { getSharedTag } from "../services/tagService";
import { Platform } from "react-native";

export default function GetSharedTagDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [shareCode, setShareCode] = useState("");

	const onClose = () => setIsOpen(false);

	const cancelRef = useRef(null);

	const toast = useToast();

	const { user } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

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
							<KeyboardAvoidingView
								behavior={
									Platform.OS === "ios" ? "padding" : "height"
								}
								height="auto">
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
							</KeyboardAvoidingView>
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
							onPress={() => {
								onClose();

								setLoading(true);

								getSharedTag(shareCode, user?.uuid)
									.then(() => {
										toast.show({
											avoidKeyboard: true,
											title: "Tag imported successfully",
										});

										setLoading(false);

										navigation.navigate("Control Panel", {
											refresh: ++global.refresh,
										});
									})
									.catch(err => {
										toast.show({
											avoidKeyboard: true,
											title: "Error importing tag",
											description: err.message,
										});

										setLoading(false);
									});
							}}>
							Import
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
}
