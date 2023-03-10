import * as React from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { loginUser, registerUser, logoutUser } from "../services/userService";

export const AuthContext = React.createContext({
	user: {
		_id: "",
		username: "",
		email: "",
		macAddress: "",
		_token: "",
	},
	login: () => {},
	register: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useAsyncStorage("user", {
		_id: "",
		username: "",
		email: "",
		macAddress: "",
		_token: "",
	});

	const login = async (username, password) => {
		const res = await loginUser(username, password).catch(console);
		console.log("user after request", res.user);
		setUser(res.user);
	};

	const register = async data => {
		const res = await registerUser(data).catch(console);
		console.log("user after request", res.user);
		setUser(res.user);
	};

	const logout = async () => {
		await logoutUser(user._token).catch(console);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				register,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
