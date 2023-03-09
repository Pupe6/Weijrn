import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, registerUser } from "../services/userService";

export const AuthContext = React.createContext({
	userToken: null,
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
						userToken: action.token,
						isLoading: false,
					};
				case "SIGN_IN":
					return {
						...prevState,
						isSignout: false,
						userToken: action.token,
					};
				case "SIGN_OUT":
					return {
						...prevState,
						isSignout: true,
						userToken: null,
					};
			}
		},
		{
			isLoading: true,
			isSignout: false,
			userToken: null,
		}
	);

	React.useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			let userToken;

			try {
				userToken = await SecureStore.getItemAsync("userToken");
			} catch (e) {
				// Restoring token failed
			}

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			dispatch({ type: "RESTORE_TOKEN", token: userToken });
		};

		bootstrapAsync();
	}, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async data => {
				const res = await loginUser(data).catch(console.log);
				dispatch({ type: "SIGN_IN", token: res.user._token });
			},
			signOut: async () => {
				await SecureStore.deleteItemAsync("userToken").catch(
					console.log
				);
				const res = await logoutUser().catch(console.log);
				console.log(res.message);
				dispatch({ type: "SIGN_OUT" });
			},
			signUp: async data => {
				const res = await registerUser(data).catch(console.log);

				dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
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
