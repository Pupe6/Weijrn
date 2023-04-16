import { createContext, useState } from "react";

export const LoadingContext = createContext({
	loading: false,
	setLoading: () => {},
	outOfContext: true,
});

export const LoadingProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ loading, setLoading }}>
			{children}
		</LoadingContext.Provider>
	);
};
