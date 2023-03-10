import * as React from "react";
import { AuthContext } from "../contexts/authContext";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";
import AdminScreen from "../screens/control-panel";
import SignOutScreen from "../screens/sign-out";

import CustomDrawerContent from "../components/custom-drawer-content";

global.__reanimatedWorkletInit = () => {};
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
	const { user } = React.useContext(AuthContext);
	return (
		<Drawer.Navigator
			initialRouteName="Sign In"
			drawerContent={props => <CustomDrawerContent {...props} />}>
			{user?._token == null ? (
				<>
					<Drawer.Screen name="Sign In" component={SignInScreen} />
					<Drawer.Screen name="Sign Up" component={SignUpScreen} />
				</>
			) : (
				<>
					<Drawer.Screen name="Home" component={HomeScreen} />
					<Drawer.Screen name="Admin" component={AdminScreen} />
					<Drawer.Screen name="Sign Out" component={SignOutScreen} />
				</>
			)}
		</Drawer.Navigator>
	);
}
