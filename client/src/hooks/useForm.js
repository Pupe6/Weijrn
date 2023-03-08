import React, { useState } from "react";
import { validateForm } from "../utils/validation";

export function useForm(initialState = {}) {
	const [formState, setFormState] = useState(initialState);
	const [formErrors, setFormErrors] = useState({});

	const handleChange = ({ field, value }) => {
		setFormState(prevState => ({
			...prevState,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		const errors = validateForm(formState);

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
		}

		return Object.keys(errors).length === 0;
	};
	return [formState, formErrors, handleChange, handleSubmit];
}
