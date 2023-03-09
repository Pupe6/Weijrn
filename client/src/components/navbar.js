// create a drawer component
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthProvider, AuthContext } from "../contexts/authContext";

import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";

export default function DrawerNavigator() {
	const Drawer = createDrawerNavigator();

	const { userToken } = React.useContext(AuthContext);
	return (
		<AuthProvider>
			<Drawer.Navigator initialRouteName="SignIn">
				{userToken == null ? (
					<>
						<Drawer.Screen name="SignIn" component={SignInScreen} />
						<Drawer.Screen name="SignUp" component={SignUpScreen} />
					</>
				) : (
					<>
						<Drawer.Screen name="Home" component={HomeScreen} />
						<Drawer.Screen
							name="SignOut"
							component={SignInScreen}
						/>
					</>
				)}
			</Drawer.Navigator>
		</AuthProvider>
	);
}
