import React from "react";

import {
	HStack,
	VStack,
	Icon,
	Button,
	Spacer,
	Text,
	useToast,
	useClipboard,
} from "native-base";
import {
	MaterialCommunityIcons,
	Entypo,
	MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { shareTag, receiveStatusUpdate } from "../services/tagService";
import { AuthContext } from "../contexts/authContext";

import DeleteTagDialog from "./delete-tag-dialog";
// import ShareTagDialog from "./share-tag-dialog";

export default function ControlPanelRow({ tag }) {
	const navigation = useNavigation();
	const toast = useToast();
	const { onCopy } = useClipboard();
	const { user } = React.useContext(AuthContext);

	return (
		<HStack
			alignItems="center"
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
			<Spacer />
			<Text
				fontSize="xs"
				color="coolGray.800"
				_dark={{
					color: "warmGray.50",
				}}
				alignSelf="flex-start">
				{tag.createdAt}
			</Text>
			<Text
				fontSize="xs"
				color="coolGray.800"
				_dark={{
					color: "warmGray.50",
				}}
				alignSelf="flex-start">
				{tag.updatedAt}
			</Text>
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
					color="coolGray.800"
				/>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				onPress={async () => {
					try {
						const res = await shareTag(
							tag.nickname,
							user.macAddress
						);
						const { shareCode } = res.shareCode;
						onCopy(shareCode);
						toast.show({
							title: "Tag coppied to clipboard",
							status: "success",
							duration: 3000,
							isClosable: true,
						});
					} catch {
						toast.show({
							title: "Error sharing tag",
							status: "error",
							duration: 3000,
							isClosable: true,
						});
					}
				}}>
				<Icon
					as={<Entypo name="share" />}
					size="sm"
					color="coolGray.800"
				/>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onPress={() => {
					navigation.navigate("Edit User", {
						tag,
					});
				}}>
				<Icon
					as={<MaterialCommunityIcons name="application-edit" />}
					size="sm"
					color="coolGray.800"
				/>
			</Button>
			<DeleteTagDialog nickname={tag.nickname} />
		</HStack>
	);
}
