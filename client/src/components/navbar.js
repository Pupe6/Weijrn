import { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { HStack, useColorModeValue, useToast } from "native-base";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";
import AdminScreen from "../screens/control-panel";
import ProfileScreen from "../screens/profile";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";
import ThemeToggle from "./theme-toggle";
import MiniProfile from "./mini-profile";
import CustomDrawerContent from "./custom-drawer-content";
import Loading from "./loading";

const Drawer = createDrawerNavigator();

export default function Navbar() {
	const { user } = useContext(AuthContext);
	const { loading } = useContext(LoadingContext);

	const bg = useColorModeValue("white", "rgb(31, 41, 55)");

	const toast = useToast();

	return (
		<>
			{loading && <Loading />}
			<Drawer.Navigator
				initialRouteName="Sign In"
				screenOptions={{
					headerStyle: {
						backgroundColor: bg,
					},

					headerRight: () => (
						<HStack space={5} mr={2} alignItems="center">
							<ThemeToggle />
							{user?._id && <MiniProfile toast={toast} />}
						</HStack>
					),
					headerTintColor: useColorModeValue("coolGray.800", "white"),
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
					drawerInactiveTintColor: useColorModeValue(
						"coolGray.800",
						"white"
					),
					drawerActiveBackgroundColor: useColorModeValue(
						"coolGray.100",
						"rgb(31, 41, 55)"
					),

					drawerInactiveBackgroundColor: useColorModeValue(
						"white",
						"rgb(31, 41, 55)"
					),
				}}
				drawerContent={props => <CustomDrawerContent {...props} />}>
				{!user?._token ? (
					<>
						<Drawer.Screen
							name="Sign In"
							component={SignInScreen}
						/>
						<Drawer.Screen
							name="Sign Up"
							component={SignUpScreen}
						/>
					</>
				) : (
					<>
						<Drawer.Screen
							name="Control Panel"
							component={AdminScreen}
							initialParams={{ refresh: ++global.refresh }}
						/>
						<Drawer.Screen
							name="Profile"
							component={ProfileScreen}
						/>
					</>
				)}
			</Drawer.Navigator>
		</>
	);
}
