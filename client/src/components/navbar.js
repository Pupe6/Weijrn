import * as React from "react";
import { AuthContext } from "../contexts/authContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HStack, useColorModeValue } from "native-base";
// import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";
import SignOutScreen from "./sign-out";
import AdminScreen from "../screens/control-panel";
// import CreateTagScreen from "../screens/create-tag";
// import EditTagScreen from "../screens/edit-tag";
import ProfileScreen from "../screens/profile";
import ThemeToggle from "./common/theme-toggle";
import MiniProfile from "./mini-profile";
import CustomDrawerContent from "../components/custom-drawer-content";

const Drawer = createDrawerNavigator();

// customize the drawer navigator to react to dark theme and light theme changes and and set header style accordingly and add ThemeToggle component to the right of the header
export default function DrawerNavigator() {
	const { user } = React.useContext(AuthContext);
	const bg = useColorModeValue("white", "rgb(31, 41, 55)");

	return (
		<Drawer.Navigator
			initialRouteName="Sign In"
			screenOptions={{
				headerStyle: {
					backgroundColor: bg,
				},

				headerRight: () => (
					<HStack space={5} mr={2} alignItems="center">
						<ThemeToggle />
						{user?._id && <MiniProfile />}
					</HStack>
				),
				headerTintColor: useColorModeValue("coolGray.800", "white"),
				// customize the drawer navigator
				drawerStyle: {
					backgroundColor: useColorModeValue(
						"white",
						"rgb(31, 41, 55)"
					),
					color: useColorModeValue("coolGray.800", "white"),
				},
				drawerActiveTintColor: useColorModeValue(
					"coolGray.800",
					"white"
				),
				drawerActiveBackgroundColor: useColorModeValue(
					"coolGray.100",
					"rgb(31, 41, 55)"
				),
				drawerInactiveTintColor: useColorModeValue(
					"coolGray.800",
					"white"
				),
				drawerInactiveBackgroundColor: useColorModeValue(
					"white",
					"rgb(31, 41, 55)"
				),
			}}
			drawerContent={props => <CustomDrawerContent {...props} />}>
			{!user?._token ? (
				<>
					<Drawer.Screen name="Sign In" component={SignInScreen} />
					<Drawer.Screen name="Sign Up" component={SignUpScreen} />
				</>
			) : (
				<>
					<Drawer.Screen
						name="Control Panel"
						component={AdminScreen}
						initialParams={{ refresh: ++global.refresh }}
					/>
					{/* <Drawer.Screen
						name="Create Tag"
						component={CreateTagScreen}
					/> */}
					{/* <Drawer.Screen name="Edit Tag" component={EditTagScreen} /> */}
					<Drawer.Screen name="Profile" component={ProfileScreen} />
				</>
			)}
		</Drawer.Navigator>
	);
}
