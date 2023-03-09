import * as React from "react";
import { useSecureStore } from "../hooks/useSecureStore";

export const authContext = React.useMemo(
	() => ({
		signIn: async data => {
			dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
		},
		signOut: () => dispatch({ type: "SIGN_OUT" }),
		signUp: async data => {
			dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
		},
	}),
	[]
);

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useSecureStore();

	return (
		<authContext.Provider value={{ state, dispatch }}>
			{children}
		</authContext.Provider>
	);
};
