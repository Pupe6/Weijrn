export const validateSignInForm = formState => {
	let errors = {};

	if (!formState.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(formState.email)) {
		errors.email = "Email is invalid";
	}

	if (!formState.password) {
		errors.password = "Password is required";
	} else if (!validatePassword(formState.password)) {
		errors.password = "Invalid password";
	}
	return errors;
};

export const validateSignUpForm = formState => {
	let errors = {};

	if (!formState.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(formState.email)) {
		errors.email = "Invalid email";
	}

	if (!formState.username) {
		errors.username = "Username is required";
	} else if (!validatePassword(formState.username)) {
		errors.username = "Invalid username";
	}

	if (!formState.password) {
		errors.password = "Password is required";
	} else if (!validatePassword(formState.password)) {
		errors.password = "Invalid Password";
	}

	if (!formState.confirmPassword) {
		errors.confirmPassword = "Confirm Password is required";
	} else if (
		!validateConfirmPassword(formState.password, formState.confirmPassword)
	) {
		errors.confirmPassword = "Passwords do not match";
	}

	if (!formState.macAddress) {
		errors.macAddress = "Mac Address is required";
	} else if (!validateMacAddress(formState.macAddress)) {
		errors.macAddress = "Invalid Mac Address";
	}

	return errors;
};
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

export function validateMacAddress(macAddress) {
	const re = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	return re.test(macAddress);
}
