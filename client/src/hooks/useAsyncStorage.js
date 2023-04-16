import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "native-base";

export const useAsyncStorage = (item, initialValue) => {
	const [value, setValue] = useState(initialValue);

	const toast = useToast();

	useEffect(() => {
		AsyncStorage.getItem(item)
			.then(value => {
				if (value !== null) {
					setValue(JSON.parse(value));
				}
			})
			.catch(err => {
				toast.show({
					avoidKeyboard: true,
					title: "Error",
					description: err.message,
				});
			});
	}, [item]);

	const setItem = async value => {
		try {
			await AsyncStorage.setItem(item, JSON.stringify(value));
			setValue(value);
		} catch (err) {
			toast.show({
				avoidKeyboard: true,
				title: "Error",
				description: err.message,
			});
		}
	};

	return [value, setItem];
};
