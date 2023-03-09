import { useEffect, useState } from "react";

export const useSessionStorage = (item, initialValue) => {
	const [value, setValue] = useState(
		JSON.parse(sessionStorage.getItem(item) || JSON.stringify(initialValue))
	);

	useEffect(() => {
		sessionStorage.setItem(item, JSON.stringify(value));
	}, [item, value]);

	return [value, setValue];
};
