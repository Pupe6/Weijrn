import React, { useState, useEffect } from "react";
import {
	Box,
	Text,
	Pressable,
	Icon,
	HStack,
	Avatar,
	VStack,
	Spacer,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { TagContext } from "../contexts/tagContext";

export function SwipeList() {
	const [listData, setListData] = useState(data);
	// useEffect(async () => {
	// 	setListData(await getTags())

	const closeRow = (rowMap, rowKey) => {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	};

	const deleteRow = (rowMap, rowKey) => {
		closeRow(rowMap, rowKey);
		const newData = [...listData];
		const prevIndex = listData.findIndex(item => item.key === rowKey);
		newData.splice(prevIndex, 1);
		setListData(newData);
	};

	const onRowDidOpen = rowKey => {
		console.log("This row opened", rowKey);
	};

	const renderItem = ({ item, index }) => (
		<Box>
			<Pressable
				onPress={() => console.log("You touched me")}
				_dark={{
					bg: "coolGray.800",
				}}
				_light={{
					bg: "white",
				}}>
				<Box pl="4" pr="5" py="2">
					<HStack alignItems="center" space={3}>
						<Avatar
							size="48px"
							source={{
								uri: item.avatarUrl,
							}}
						/>
						<VStack>
							<Text
								color="coolGray.800"
								_dark={{
									color: "warmGray.50",
								}}
								bold>
								{item.fullName}
							</Text>
							<Text
								color="coolGray.600"
								_dark={{
									color: "warmGray.200",
								}}>
								{item.recentText}
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
							{item.timeStamp}
						</Text>
					</HStack>
				</Box>
			</Pressable>
		</Box>
	);

	const renderHiddenItem = (data, rowMap) => (
		<HStack flex="1" pl="2">
			<Pressable
				w="70"
				ml="auto"
				cursor="pointer"
				bg="coolGray.200"
				justifyContent="center"
				onPress={() => closeRow(rowMap, data.item.key)}
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
				onPress={() => deleteRow(rowMap, data.item.key)}
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

	return (
		<Box bg="white" safeArea flex="1">
			<SwipeListView
				data={listData}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
				rightOpenValue={-130}
				previewRowKey={"0"}
				previewOpenValue={-40}
				previewOpenDelay={3000}
				onRowDidOpen={onRowDidOpen}
			/>
		</Box>
	);
}
