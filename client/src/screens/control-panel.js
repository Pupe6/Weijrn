import React, { useState, useEffect, useContext } from "react";
import { Center, Box, Heading, HStack, use } from "native-base";
import { getTags } from "../services/tagService";
import { ScrollView } from "react-native";
// import SwipeList from "../components/swipe-list";
import ControlPanelRow from "../components/control-panel-row";
import GetSharedTagDialog from "../components/get-shared-tag-dialog";
import CreateTagDialog from "../components/create-tag-dialog";
import SearchBar from "../components/search-bar";
import { AuthContext } from "../contexts/authContext";

export default function AdminScreen(props) {
	const [listData, setListData] = useState({
		count: 0,
		tags: [],
		filteredTags: [],
	});
	const { user } = useContext(AuthContext);

	useEffect(() => {
		getTags(user.macAddress)
			.then(res => {
				setListData({
					count: res.count,
					tags: res.tags,
					filteredTags: res.tags,
				});
			})
			.catch(alert);
	}, [props?.route?.params?.refresh]);
	return (
		<Box
			_dark={{
				bg: "coolGray.800",
			}}
			_light={{
				bg: "white",
			}}
			flex="1"
			safeAreaTop
			w={["100%", "100%", "100%", "100%"]}>
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
						<SearchBar
							listData={listData}
							setListData={setListData}
						/>
						<HStack space={2} p="4" pb="3" justifyContent="center">
							<CreateTagDialog />
							<GetSharedTagDialog />
						</HStack>
					</HStack>

					<ScrollView showsVerticalScrollIndicator={false}>
						{listData.filteredTags.map((tag, index) => (
							<ControlPanelRow key={index} tag={tag} />
						))}
					</ScrollView>
				</Box>
			</Center>
		</Box>
	);
}
