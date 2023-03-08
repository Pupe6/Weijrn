import React, { useState } from "react";
import { validateForm, validateField } from "../utils/validation";

export default function useForm(initialState = {}) {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState({});

	const handleChange = (name, value) => {
		setValues({ ...values, [name]: value });
		if (errors[name]) {
			const [error, secondaryError] = validateField(
				{ target: { name, value } },
				values
			);
			setErrors({ ...errors, [name]: error || null });

			if (secondaryError) {
				setErrors({ ...errors, [name]: secondaryError || null });
			}
		}
	};
	const handleBlur = event => {
		const [error, secondaryError] = validateField(event, values);
		setErrors({ ...errors, [event.target.name]: error || null });

		if (secondaryError) {
			setErrors({
				...errors,
				[event.target.name]: secondaryError || null,
			});
		}
	};

	const handleSubmit = event => {
		event.preventDefault();
		const validationErrors = validateForm(values);
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	return [formState, formErrors, handleChange, handleBlur, handleSubmit];
}
