export function validateField(event, args) {
	const { name, value } = event.target;
	let error = null;
	let secondaryError = null;

	switch (name) {
		case "email":
			if (!validateEmail(value)) {
				error = "Please enter a valid email address.";
			}
			break;
		case "username":
			if (!validateUsername(value)) {
				error = "Please enter a valid username.";
			}
			break;
		case "password":
			if (!validatePassword(value)) {
				error = "Please enter a valid password.";
			}
			break;
		case "confirmPassword":
			if (!validateConfirmPassword(args.password, value)) {
				error = "Passwords do not match.";
			}
			break;
		default:
			break;
	}
	return { error, secondaryError };
}

export function validateForm(formState, args) {
	const errors = {};

	for (key in formState) {
		const { error, secondaryError } = validateField(
			{ target: { name: key, value: formState[key] } },
			args
		);
		if (error) {
			errors[key] = error;
		}
		if (secondaryError) {
			errors[key] = secondaryError;
		}
	}
	return errors;
}

export function validateEmail(email) {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
}

export function validateUsername(username) {
	const re = /^[a-zA-Z0-9]+$/;
	return re.test(username);
}

export function validatePassword(password) {
	const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	return re.test(password);
}

export function validateConfirmPassword(password, confirmPassword) {
	return password === confirmPassword;
}
