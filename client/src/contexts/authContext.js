import { createContext } from "react";

import { useSessionStorage } from "../hooks/useSessionStorage";

export const AuthContext = createContext({
	user: {
		_id: "",
		username: "",
		email: "",
		_tags: [],
	},
	setUser: user => {
		return user;
	},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useSessionStorage("user", {});

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};
