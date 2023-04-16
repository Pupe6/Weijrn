import React, { useState, useEffect, useContext } from "react";
import { Center, Box, Heading, HStack, useToast } from "native-base";
import { getTags } from "../services/tagService";
import { ScrollView } from "react-native";
import ControlPanelRow from "../components/control-panel-row";
import GetSharedTagDialog from "../components/get-shared-tag-dialog";
import CreateTagDialog from "../components/create-tag-dialog";
import SearchBar from "../components/search-bar";
import { AuthContext } from "../contexts/authContext";
import Loading from "../components/loading";

export default function AdminScreen(props) {
	const [listData, setListData] = useState({
		tags: [],
		filteredTags: [],
	});
	const [loading, setLoading] = useState(false);
	const [noTags, setNoTags] = useState(false);

	const { user, setUser } = useContext(AuthContext);

	const toast = useToast();

	useEffect(() => {
		setLoading(true);

		getTags(user?._token)
			.then(tags => {
				setListData({
					tags,
					filteredTags: tags,
				});

				if (tags.length === 0) setNoTags(true);
				else setNoTags(false);

				setLoading(false);
			})
			.catch(err => {
				if (err.message === "Token is not valid.") {
					toast.show({
						title: "Session expired",
						description: "Please log in again.",
					});

					setUser(null);
				} else
					toast.show({
						title: "Error getting tags",
						description: err.message,
					});

				setLoading(false);
			});
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
			{loading && <Loading />}

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

					{noTags ? (
						<Center flex="1" mt="10">
							<Heading size="lg">No tags yet...</Heading>
						</Center>
					) : (
						<ScrollView showsVerticalScrollIndicator={false}>
							{listData.filteredTags.map((tag, index) => (
								<ControlPanelRow key={index} tag={tag} />
							))}
						</ScrollView>
					)}
				</Box>
			</Center>
		</Box>
	);
}
