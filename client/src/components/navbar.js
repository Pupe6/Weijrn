import { useContext, lazy, Suspense } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Flex, useColorModeValue, useToast } from "native-base";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";
import ThemeToggle from "./theme-toggle";
import MiniProfile from "./mini-profile";
import Loading from "./loading";
import FallbackSkeleton from "./fallback-skeleton";

const SignInScreen = lazy(() => import("../screens/sign-in"));
const SignUpScreen = lazy(() => import("../screens/sign-up"));
const ControlPanel = lazy(() => import("../screens/control-panel"));
const ProfileScreen = lazy(() => import("../screens/profile"));
const CustomDrawerContent = lazy(() => import("./custom-drawer-content"));

const LazySignInScreen = props => (
	<Suspense width="100%" height="100%" fallback={<FallbackSkeleton />}>
		<SignInScreen {...props} />
	</Suspense>
);

const LazySignUpScreen = props => (
	<Suspense fallback={<FallbackSkeleton />}>
		<SignUpScreen {...props} />
	</Suspense>
);

const LazyControlPanel = props => (
	<Suspense fallback={<FallbackSkeleton />}>
		<ControlPanel {...props} />
	</Suspense>
);

const LazyProfileScreen = props => (
	<Suspense fallback={<FallbackSkeleton />}>
		<ProfileScreen {...props} />
	</Suspense>
);

const LazyCustomDrawerContent = props => (
	<Suspense>
		<CustomDrawerContent {...props} />
	</Suspense>
);

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
						shadowColor: useColorModeValue(
							"rgb(31, 41, 55)",
							"white"
						),
					},

					headerRight: () => (
						<Flex
							alignItems="center"
							gap={4}
							mr={{ base: 2, md: 4 }}
							direction="row">
							<ThemeToggle />
							{user?._id && <MiniProfile toast={toast} />}
						</Flex>
					),
					headerTintColor: useColorModeValue(
						"rgb(31, 41, 55)",
						"white"
					),
					drawerStyle: {
						backgroundColor: useColorModeValue(
							"white",
							"rgb(31, 41, 55)"
						),
						color: useColorModeValue("rgb(31, 41, 55)", "white"),
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
				drawerContent={props => <LazyCustomDrawerContent {...props} />}>
				{!user?._token ? (
					<>
						<Drawer.Screen
							name="Sign In"
							component={LazySignInScreen}
						/>

						<Drawer.Screen
							name="Sign Up"
							component={LazySignUpScreen}
						/>
					</>
				) : (
					<>
						<Drawer.Screen
							name="Control Panel"
							component={LazyControlPanel}
							initialParams={{ refresh: ++global.refresh }}
						/>

						<Drawer.Screen
							name="Profile"
							component={LazyProfileScreen}
						/>
					</>
				)}
			</Drawer.Navigator>
		</>
	);
}
