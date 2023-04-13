import * as React from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import {
	loginUser,
	registerUser,
	logoutUser,
	checkTokenValidity,
} from "../services/userService";

export const AuthContext = React.createContext({
	user: {
		_id: "",
		username: "",
		email: "",
		macAddress: "",
		_token: "",
	},
	login: async () => {},
	register: async () => {},
	logout: async () => {},
	setUser: () => {},
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
		const res = await loginUser(username, password).catch(console.error);
		setUser(res.user);
	};

	const register = async data => {
		const res = await registerUser(data).catch(console.error);
		setUser(res.user);
	};

	const logout = async () => {
		await logoutUser(user?._token).catch(console.error);
		setUser(null);
	};

	// Check if token is valid and log out if not
	React.useEffect(() => {
		if (user?._token) {
			checkTokenValidity(user?._token)
				.then(res => {
					if (!res.valid) setUser(null);
				})
				.catch(() => setUser(null));
		}
	}, [user?._token]);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				login,
				register,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
