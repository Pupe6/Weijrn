import { useState, useEffect, useContext, lazy, Suspense } from "react";
import {
	Center,
	Box,
	Heading,
	HStack,
	useToast,
	FlatList,
	useBreakpointValue,
	Flex,
} from "native-base";
import { getTags } from "../services/tagService";
import ImportTagDialog from "../components/import-tag-dialog";
import CreateTagDialog from "../components/create-tag-dialog";
import SearchBar from "../components/search-bar";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";

const ControlPanelRow = lazy(() => import("../components/control-panel-row"));

const LazyControlPanelRow = props => (
	<Suspense
		fallback={
			<Center
				mt={{ base: 5, md: 10 }}
				rounded="lg"
				_dark={{
					bg: "coolGray.900",
				}}
				_light={{
					bg: "coolGray.100",
				}}
				p="8"
			/>
		}>
		<ControlPanelRow {...props} />
	</Suspense>
);

export default function ControlPanel(props) {
	const [listData, setListData] = useState({
		tags: [],
		filteredTags: [],
	});
	const [noTags, setNoTags] = useState(false);
	const [noSearchResults, setNoSearchResults] = useState(false);

	const { user, setUser } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	const toast = useToast();

	useEffect(() => {
		setLoading(true);

		getTags(user?._token)
			.then(tags => {
				if (tags.length === 0) setNoTags(true);
				else setNoTags(false);

				setListData({
					tags,
					filteredTags: tags,
				});

				setLoading(false);
			})
			.catch(err => {
				if (err.message === "Token is not valid.") {
					toast.show({
						avoidKeyboard: true,
						title: "Session expired",
						description: "Please log in again.",
					});

					setUser(null);
				} else
					toast.show({
						avoidKeyboard: true,
						title: "Error getting tags",
						description: err.message,
					});

				setLoading(false);
			});
	}, [props?.route?.params?.refresh]);

	useEffect(() => {
		if (listData.filteredTags.length === 0) setNoSearchResults(true);
		else setNoSearchResults(false);
	}, [listData.filteredTags]);

	const isMobile = useBreakpointValue({ base: true, sm: false });

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
			<Center h={["100%", "100%", "100%", "100%"]}>
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
					<Flex direction="column">
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
							{!isMobile && (
								<SearchBar
									listData={listData}
									setListData={setListData}
								/>
							)}
							<HStack
								space={2}
								p="4"
								pb="3"
								justifyContent="center">
								<CreateTagDialog />
								<ImportTagDialog />
							</HStack>
						</HStack>
						{isMobile && (
							<Box w={"80%"} mr={"auto"} ml={"auto"}>
								<SearchBar
									listData={listData}
									setListData={setListData}
								/>
							</Box>
						)}
					</Flex>

					{noTags && (
						<Center mt={{ base: 5, md: 10 }}>
							<Heading size="md">No tags yet...</Heading>
						</Center>
					)}

					{!noTags && noSearchResults && (
						<Center mt={{ base: 5, md: 10 }}>
							<Heading size="md">No results found...</Heading>
						</Center>
					)}

					{!noTags && !noSearchResults && (
						<FlatList
							data={listData.filteredTags}
							renderItem={tag => (
								<LazyControlPanelRow tag={tag.item} />
							)}
							keyExtractor={tag => tag._id}
						/>
					)}
				</Box>
			</Center>
		</Box>
	);
}
