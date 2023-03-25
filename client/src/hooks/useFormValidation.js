import { useState, useEffect } from "react";

import {
	validateUsername,
	validateEmail,
	validatePassword,
	validateConfirmPassword,
	validateMacAddress,
} from "../utils/validation";

export const useFormValidation = (initialState, validate) => {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	useEffect(() => {
		if (isSubmitting) {
			const noErrors = Object.keys(errors).length === 0;
			if (noErrors) {
				setIsSubmitting(false);
			} else {
				setIsSubmitting(false);
			}
		}
	}, [isSubmitting]);

	const handleChange = (name, value) => {
		setValues({ ...values, [name]: value });

		switch (name) {
			case "username":
				setErrors({ ...errors, username: validateUsername(value) });
				break;
			case "email":
				setErrors({ ...errors, email: validateEmail(value) });
				break;
			case "password":
				setErrors({ ...errors, password: validatePassword(value) });
				break;
			case "confirmPassword":
				setErrors({
					...errors,
					confirmPassword: validateConfirmPassword(
						value,
						values.password
					),
				});
				break;
			case "macAddress":
				setErrors({ ...errors, macAddress: validateMacAddress(value) });
				break;
		}
	};

	const handleSubmit = () => {
		const validation = validate(values);
		for (let key in validation) {
			setErrors(prevState => ({
				...prevState,
				[key]: validation[key],
			}));
		}
		setIsSubmitting(true);
	};

	return {
		values,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
	};
};
