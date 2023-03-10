import React from "react";
import { Box, Heading, ScrollView, Center } from "native-base";

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
				<ScrollView showsVerticalScrollIndicator={false}>
					<Basic />
				</ScrollView>
			</Box>
		</Center>
	);
}
