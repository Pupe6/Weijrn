import React, { useState } from "react";

export const useFormValidation = (initialState, validate) => {
	const [values, setValues] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (name, value) => {
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = () => {
		const validationErrors = validate(values);
		setErrors(validationErrors);
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
