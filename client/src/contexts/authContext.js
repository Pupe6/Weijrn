import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, registerUser, logoutUser } from "../services/userService";

export const AuthContext = React.createContext({
	user: {
		_id: "",
		username: "",
		email: "",
		macAddress: "",
		_token: "",
	},
	isLoading: true,
	isSignout: false,
	signIn: async data => {},
	signUp: async data => {},
	signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case "RESTORE_TOKEN":
					return {
						...prevState,
						user: action.user,
						isLoading: false,
					};
				case "SIGN_IN":
					return {
						...prevState,
						isSignout: false,
						user: action.user,
					};
				case "SIGN_OUT":
					return {
						...prevState,
						isSignout: true,
						user: null,
					};
			}
		},
		{
			user: null,
			isLoading: true,
			isSignout: false,
		}
	);

	React.useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			try {
				let user = (await SecureStore.getItemAsync("user")) || null;
				dispatch({ type: "RESTORE_TOKEN", user: JSON.parse(user) });

				// After restoring token, we may need to validate it in production apps

				// This will switch to the App screen or Auth screen and this loading
				// screen will be unmounted and thrown away.
			} catch (err) {
				console.log(err);
			}
		};

		bootstrapAsync();
	}, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async data => {
				const res = await loginUser(data).catch(console.log);
				dispatch({ type: "SIGN_IN", user: res.user });
			},
			signOut: async () => {
				const res = await logoutUser(
					JSON.parse(await SecureStore.getItemAsync("user"))._token ||
						null
				).catch(console.log);
				await SecureStore.deleteItemAsync("user").catch(console.log);
				dispatch({ type: "SIGN_OUT" });
			},
			signUp: async data => {
				const res = await registerUser(data).catch(console.log);
				dispatch({ type: "SIGN_IN", user: res.user });
			},
		}),
		[]
	);

	return (
		<AuthContext.Provider value={{ ...state, ...authContext }}>
			{children}
		</AuthContext.Provider>
	);
};
