import React from "react";

import {
	HStack,
	VStack,
	Icon,
	Button,
	Text,
	useToast,
	useClipboard,
	Tooltip,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { receiveStatusUpdate } from "../services/tagService";
import { AuthContext } from "../contexts/authContext";
import DeleteTagDialog from "./delete-tag-dialog";
import EditTagDialog from "./edit-tag-dialog";
import ShareTagDialog from "./share-tag-dialog";

export default function ControlPanelRow({ tag }) {
	const toast = useToast();
	const { user } = React.useContext(AuthContext);

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
					label="Write to tag"
					placement="top"
					arrowSize={10}
					arrowShadowColor="coolGray.800">
					<Button
						variant="ghost"
						size="sm"
						onPress={async () => {
							try {
								const res = await receiveStatusUpdate(
									user.macAddress,
									tag._id
								);
								toast.show({
									title: res.message,
									status: "success",
									duration: 3000,
									isClosable: true,
								});
							} catch {
								toast.show({
									title: "Error receiving status update",
									status: "error",
									duration: 3000,
									isClosable: true,
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
				{user._id === tag._owner && <ShareTagDialog tag={tag} />}
				<EditTagDialog tag={tag} />
				<DeleteTagDialog tag={tag} />
			</HStack>
		</HStack>
	);
}
