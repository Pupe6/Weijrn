import { useState, useEffect } from "react";
import {
	Input,
	useBreakpointValue,
	Icon,
	KeyboardAvoidingView,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchBar({ listData, setListData }) {
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (search === "") {
			setListData({
				...listData,
				filteredTags: listData.tags,
			});
		} else {
			const filteredTags = listData.tags.filter(tag => {
				return tag.nickname
					.toLowerCase()
					.includes(search.toLowerCase());
			});
			setListData({
				...listData,
				filteredTags,
			});
		}
	}, [search]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			height="auto">
			<Input
				onChangeText={setSearch}
				placeholder="Search Tags"
				_light={{
					placeholderTextColor: "blueGray.400",
				}}
				_dark={{
					placeholderTextColor: "blueGray.50",
				}}
				borderRadius={4}
				py={3}
				px={1}
				fontSize={14}
				_web={{
					_focus: {
						borderColor: "muted.300",
						style: {
							boxShadow: "none",
						},
					},
				}}
				InputLeftElement={
					<Icon
						as={<FontAwesome name="search" />}
						size="sm"
						ml={2}
						color="muted.400"
					/>
				}
			/>
		</KeyboardAvoidingView>
	);
}
