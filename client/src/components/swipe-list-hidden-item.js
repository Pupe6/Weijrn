import { HStack, VStack, Icon, Button } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { closeRow } from "../utils/swipe-list";
import { useNavigation } from "@react-navigation/native";
import DeleteModal from "./delete-tag-dialog";

export default function renderHiddenItem({ tag, id }) {
	const navigation = useNavigation();
	return (
		<HStack px="4">
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
			<DeleteModal nickname={tag.nickname}></DeleteModal>
		</HStack>
	);
}
