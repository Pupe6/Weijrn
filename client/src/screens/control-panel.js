import React, { useState, useEffect, useContext } from "react";
import { Center, Box, Heading, HStack } from "native-base";
import { getTags } from "../services/tagService";
import { ScrollView } from "react-native";
// import SwipeList from "../components/swipe-list";
import ControlPanelRow from "../components/control-panel-row";
import GetSharedTagDialog from "../components/get-shared-tag-dialog";
import CreateTagDialog from "../components/create-tag-dialog";

import { AuthContext } from "../contexts/authContext";

export default function AdminScreen(props) {
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
	}, [props?.route?.params?.refresh]);
	return (
		<Center>
			<Box
				_dark={{
					bg: "coolGray.800",
				}}
				_light={{
					bg: "white",
				}}
				flex="1"
				safeAreaTop
				maxW="500px"
				w="100%">
				<HStack
					_dark={{
						bg: "coolGray.800",
					}}
					_light={{
						bg: "white",
					}}
					justifyContent="space-between"
					alignItems="center">
					<Heading p="4" pb="3" size="lg">
						Tags
					</Heading>
					<CreateTagDialog />
					<GetSharedTagDialog />
				</HStack>

				<ScrollView showsVerticalScrollIndicator={false}>
					{listData.tags.map((tag, index) => (
						<ControlPanelRow key={index} tag={tag} />
					))}
				</ScrollView>
			</Box>
		</Center>
	);
}
