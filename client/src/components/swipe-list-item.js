import { Box, HStack, Pressable, Spacer, Text, VStack } from "native-base";

export default function SwipeListItem({ tag, index }) {
	return (
		<Box>
			<Pressable
				_dark={{
					bg: "coolGray.800",
				}}
				_light={{
					bg: "white",
				}}>
				<Box pl="4" pr="5" py="2">
					<HStack alignItems="center" space={3}>
						<VStack>
							<Text
								color="coolGray.800"
								_dark={{
									color: "warmGray.50",
								}}
								bold>
								{tag.nickname}
							</Text>
							<Text
								color="coolGray.600"
								_dark={{
									color: "warmGray.200",
								}}>
								{tag.type}
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
							{tag.createdAt}
						</Text>
						<Text
							fontSize="xs"
							color="coolGray.800"
							_dark={{
								color: "warmGray.50",
							}}
							alignSelf="flex-start">
							{tag.updatedAt}
						</Text>
					</HStack>
				</Box>
			</Pressable>
		</Box>
	);
}
