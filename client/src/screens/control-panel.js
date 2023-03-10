import React from "react";
import { Box, Heading, ScrollView, Center, HStack } from "native-base";
import { getTags } from "../services/tagService";

export default function AdminScreen() {
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
					Rfids
				</Heading>
				{/* <ScrollView showsVerticalScrollIndicator={false}>
					{getTags().map(tag => (
						<Box
							key={tag._id}
							_dark={{
								bg: "coolGray.800",
							}}
							_light={{
								bg: "white",
							}}
							rounded="lg"
							shadow={1}
							m="4"
							p="4">
							

				</ScrollView> */}
			</Box>
		</Center>
	);
}
