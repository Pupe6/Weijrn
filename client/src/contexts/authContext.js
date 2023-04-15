import { createContext, useEffect } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import {
	loginUser,
	registerUser,
	logoutUser,
	checkTokenValidity,
} from "../services/userService";
import { useToast } from "native-base";

export const AuthContext = createContext({
	user: {
		_id: "",
		username: "",
		email: "",
		uuid: "",
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
		uuid: "",
		_token: "",
	});

	const toast = useToast();

	const login = async (username, password) => {
		const user = await loginUser(username, password).catch(err => {
			toast.show({
				title: "Error",
				description: err.message,
			});
		});
		setUser(user);
	};

	const register = async data => {
		const user = await registerUser(data).catch(err => {
			toast.show({
				title: "Error",
				description: err.message,
			});
		});
		setUser(user);
	};

	const logout = async () => {
		await logoutUser(user?._token).catch(err => {
			toast.show({
				title: "Error",
				description: err.message,
			});
		});
		setUser(null);
	};

	// Check if token is valid and log out if not
	useEffect(() => {
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
