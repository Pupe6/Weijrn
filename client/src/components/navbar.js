// create a drawer component
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from "../contexts/authContext";

import HomeScreen from "../screens/home";
import SignInScreen from "../screens/sign-in";
import SignUpScreen from "../screens/sign-up";

export default function DrawerNavigator() {
	const Drawer = createDrawerNavigator();

	const { user } = React.useContext(AuthContext);
	return (
		<NavigationContainer>
			<Drawer.Navigator initialRouteName="SignIn">
				{user?._token == null ? (
					<>
						<Drawer.Screen name="SignIn" component={SignInScreen} />
						<Drawer.Screen name="SignUp" component={SignUpScreen} />
					</>
				) : (
					<>
						<Drawer.Screen name="Home" component={HomeScreen} />
					</>
				)}
			</Drawer.Navigator>
		</NavigationContainer>
	);
}
