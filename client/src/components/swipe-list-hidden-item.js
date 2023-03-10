import { HStack, Text, VStack, Icon, Button } from "native-base";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { closeRow, deleteRow } from "../utils/swipe-list";
import { useNavigation } from "@react-navigation/native";

export default function renderHiddenItem({ tag, id }) {
	const navigation = useNavigation();
	return (
		<HStack
			alignItems="center"
			justifyContent="flex-end"
			px="4"
			display="flex">
			<VStack flex="1" alignItems="flex-start">
				<Button
					onPress={() => {
						closeRow(id);
						navigation.navigate("Edit Tag", { tag });
					}}>
					<Icon
						as={<MaterialIcons name="edit" />}
						size="sm"
						color="white"
					/>
				</Button>
			</VStack>
			<VStack flex="1" alignItems="flex-end">
				<Button onPress={() => deleteRow(id)}>
					<Icon
						as={<Entypo name="trash" />}
						size="sm"
						color="white"
					/>
				</Button>
			</VStack>
		</HStack>
	);
}
