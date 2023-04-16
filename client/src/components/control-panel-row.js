import { useContext } from "react";

import {
	HStack,
	VStack,
	Icon,
	Button,
	Text,
	useToast,
	Tooltip,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { receiveStatusUpdate } from "../services/tagService";
import DeleteTagDialog from "./delete-tag-dialog";
import EditTagDialog from "./edit-tag-dialog";
import ShareTagDialog from "./share-tag-dialog";
import { AuthContext } from "../contexts/authContext";

export default function ControlPanelRow({ tag }) {
	const toast = useToast();

	const { user } = useContext(AuthContext);

	return (
		<HStack
			alignItems="center"
			justifyContent={"space-between"}
			space={3}
			p="4"
			_dark={{
				bg: "coolGray.800",
			}}
			_light={{
				bg: "white",
			}}
			rounded="lg">
			<VStack>
				<Text
					color="coolGray.800"
					_dark={{
						color: "warmGray.50",
					}}
					bold>
					{tag.nickname}
				</Text>
				<Text
					color="coolGray.600"
					_dark={{
						color: "warmGray.200",
					}}>
					{tag.type}
				</Text>
			</VStack>
			<HStack space={2}>
				<Tooltip
					label="Use tag"
					placement="top"
					arrowSize={10}
					arrowShadowColor="coolGray.800">
					<Button
						variant="ghost"
						size="sm"
						onPress={async () => {
							try {
								const res = await receiveStatusUpdate(
									user?.uuid,
									tag._id
								);
								toast.show({
									avoidKeyboard: true,
									title: res.message,
									duration: 3000,
								});
							} catch {
								toast.show({
									avoidKeyboard: true,
									title: "Error receiving status update",
									duration: 3000,
								});
							}
						}}>
						<Icon
							as={
								<MaterialIcons
									name="call-received"
									size={24}
									color="white"
								/>
							}
							size="sm"
							_dark={{
								color: "white",
							}}
							_light={{
								color: "coolGray.800",
							}}
						/>
					</Button>
				</Tooltip>
				{user?._id === tag._owner && <ShareTagDialog tag={tag} />}
				<EditTagDialog tag={tag} />
				<DeleteTagDialog tag={tag} />
			</HStack>
		</HStack>
	);
}
