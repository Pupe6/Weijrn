import React, { useState } from "react";
import { validateForm, validateField } from "../utils/validation";

export default function useForm(initialState = {}) {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState({});

	const handleChange = (e, ...args) => {
		setValues(values => ({ ...values, [e.target.name]: e.target.value }));

		if (errors[e.target.name]) {
			const [error, secondaryError] = validateField(e, args);
			setErrors({ ...errors, [e.target.name]: error || null });

			if (secondaryError) {
				setErrors({
					...errors,
					[e.target.name]: secondaryError || null,
				});
			}
		}
	};

	const handleBlur = (e, ...args) => {
		const [error, secondaryError] = validateField(e, args);
		setErrors({ ...errors, [e.target.name]: error || null });

		if (secondaryError) {
			setErrors({ ...errors, [e.target.name]: secondaryError || null });
		}
	};

	const handleSubmit = (e, ...args) => {
		e.preventDefault();
		const validationErrors = validateForm(e, args);
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	return [formState, formErrors, handleChange, handleBlur, handleSubmit];
}
