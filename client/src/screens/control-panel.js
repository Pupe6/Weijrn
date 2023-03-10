import React, { useState, useEffect, useContext } from "react";
import { Center, Box, Heading } from "native-base";
import { getTags } from "../services/tagService";
import { ScrollView } from "react-native";
import SwipeList from "../components/swipe-list";
import { AuthContext } from "../contexts/authContext";

export default function AdminScreen() {
	const [listData, setListData] = useState({
		count: 0,
		tags: [],
	});
	const { user } = useContext(AuthContext);

	useEffect(() => {
		getTags(user.macAddress)
			.then(res => {
				setListData({
					count: res.count,
					tags: res.tags,
				});
			})
			.catch(alert);
	}, []);
	return (
		<Center h="290px">
			<Box
				_dark={{
					bg: "coolGray.800",
				}}
				_light={{
					bg: "white",
				}}
				flex="1"
				safeAreaTop
				maxW="400px"
				w="100%">
				<Heading p="4" pb="3" size="lg">
					Inbox
				</Heading>
				<ScrollView showsVerticalScrollIndicator={false}>
					<SwipeList tags={listData.tags} />
				</ScrollView>
			</Box>
		</Center>
	);
}
