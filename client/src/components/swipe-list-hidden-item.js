import { HStack, Text, VStack, Icon } from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { closeRow, deleteRow } from "../utils/swipe-list";

export default function renderHiddenItem({ tag, id }) {
	console.log("in hidden items", tag, id);
	return (
		<HStack pl="2">
			<Pressable
				w="70"
				ml="auto"
				cursor="pointer"
				bg="coolGray.200"
				justifyContent="center"
				// onPress={() => closeRow(tag, id)}
				_pressed={{
					opacity: 0.5,
				}}>
				<VStack alignItems="center" space={2}>
					<Icon
						as={<Entypo name="dots-three-horizontal" />}
						size="xs"
						color="coolGray.800"
					/>
					<Text
						fontSize="xs"
						fontWeight="medium"
						color="coolGray.800">
						More
					</Text>
				</VStack>
			</Pressable>
			<Pressable
				w="70"
				cursor="pointer"
				bg="red.500"
				justifyContent="center"
				// onPress={() => deleteRow(tag, id)}
				_pressed={{
					opacity: 0.5,
				}}>
				<VStack alignItems="center" space={2}>
					<Icon
						as={<MaterialIcons name="delete" />}
						color="white"
						size="xs"
					/>
					<Text color="white" fontSize="xs" fontWeight="medium">
						Delete
					</Text>
				</VStack>
			</Pressable>
		</HStack>
	);
}

// <HStack
// 	flex="1"
// 	alignItems="center"
// 	justifyContent="space-between"
// 	px="4">
// 	<Pressable
// 	// onPress={() => {
// 	// 	closeRow(rowMap, tag._id);
// 	// }}
// 	>
// 		<Icon
// 			as={<MaterialIcons name="delete" />}
// 			size="sm"
// 			color="white"
// 		/>
// 	</Pressable>
// 	<Pressable
// 		onPress={() => {
// 			deleteRow(rowMap, tag._id);
// 		}}>
// 		<Icon as={<Entypo name="trash" />} size="sm" color="white" />
// 	</Pressable>
// </HStack>
