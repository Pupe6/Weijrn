import { useState, useEffect } from "react";

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
