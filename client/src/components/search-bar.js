// search bar thats responsive to the screen size with only icon on mobile and icon and text on desktop

import React from "react";
import { Input, useBreakpointValue, Icon } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchBar() {
	// make search expandable on mobile and full width on desktop
	const isMobile = useBreakpointValue({ base: true, md: false });
	return (
		<Input
			placeholder="Search Tags"
			bg="#fff"
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
	);
}
