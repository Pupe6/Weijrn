// create a drawer component
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthProvider, AuthContext } from "../contexts/authContext";

import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";

export default function DrawerNavigator() {
	const Drawer = createDrawerNavigator();

	const { userToken, isLoading } = React.useContext(AuthContext);
	console.log("userToken", isLoading);
	return (
		<AuthProvider>
			<Drawer.Navigator initialRouteName="Home">
				{userToken == null ? (
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
						<Drawer.Screen name="Home" component={HomeScreen} />
						<Drawer.Screen
							name="Sign Out"
							component={SignInScreen}
						/>
					</>
				)}
			</Drawer.Navigator>
		</AuthProvider>
	);
}
