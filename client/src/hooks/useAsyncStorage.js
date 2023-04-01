import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorage = (item, initialValue) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		AsyncStorage.getItem(item)
			.then(value => {
				if (value !== null) {
					setValue(JSON.parse(value));
				}
			})
			.catch(error =>
				console.log("Error getting item from AsyncStorage:", error)
			);
	}, [item]);

	const setItem = async value => {
		try {
			await AsyncStorage.setItem(item, JSON.stringify(value));
			setValue(value);
		} catch (error) {
			console.log("Error setting item to AsyncStorage:", error);
		}
	};

	return [value, setItem];
};
