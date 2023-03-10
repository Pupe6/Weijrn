import * as React from "react";
import { AuthContext } from "../contexts/authContext";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";
import SignOutScreen from "../screens/sign-out";
import AdminScreen from "../screens/control-panel";
import CreateTagScreen from "../screens/create-tag";
import EditTagScreen from "../screens/edit-tag";
import ProfileScreen from "../screens/profile";

import CustomDrawerContent from "../components/custom-drawer-content";

global.__reanimatedWorkletInit = () => {};
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
	const { user } = React.useContext(AuthContext);
	return (
		<Drawer.Navigator
			initialRouteName="Sign In"
			drawerContent={props => <CustomDrawerContent {...props} />}>
			{!user?._token ? (
				<>
					<Drawer.Screen name="Sign In" component={SignInScreen} />
					<Drawer.Screen name="Sign Up" component={SignUpScreen} />
				</>
			) : (
				<>
					<Drawer.Screen name="Home" component={HomeScreen} />
					<Drawer.Screen
						name="Control Panel"
						component={AdminScreen}
					/>
					<Drawer.Screen
						name="Create Tag"
						component={CreateTagScreen}
					/>
					<Drawer.Screen name="Edit Tag" component={EditTagScreen} />
					<Drawer.Screen name="Profile" component={ProfileScreen} />
					<Drawer.Screen name="Sign Out" component={SignOutScreen} />
				</>
			)}
		</Drawer.Navigator>
	);
}
