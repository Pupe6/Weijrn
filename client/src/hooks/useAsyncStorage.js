import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorage = async (item, initialValue) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		AsyncStorage.getItem(item).then(value => {
			if (value) {
				setValue(JSON.parse(value));
			}
		});
	}, [item]);

	const setItem = value => {
		AsyncStorage.setItem(item, JSON.stringify(value));
		setValue(value);
	};

	return [value, setItem];
};
