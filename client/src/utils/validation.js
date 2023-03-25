export const validateSignInForm = formState => {
	let errors = {};

	if (!formState.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(formState.email)) {
		errors.email = "Email is invalid";
	} else {
		errors.email = null;
	}

	if (!formState.password) {
		errors.password = "Password is required";
	} else if (!validatePassword(formState.password)) {
		errors.password = "Invalid password";
	} else {
		errors.password = null;
	}
	return errors;
};

export const validateSignUpForm = formState => {
	let errors = {};

	if (!formState.email) {
		errors.email = "Email is required";
	} else if (!validateEmail(formState.email)) {
		errors.email = "Invalid email";
	} else {
		errors.email = null;
	}

	if (!formState.username) {
		errors.username = "Username is required";
	} else if (!validateUsername(formState.username)) {
		errors.username = "Invalid username";
	} else {
		errors.username = null;
	}

	if (!formState.password) {
		errors.password = "Password is required";
	} else if (!validatePassword(formState.password)) {
		errors.password = "Invalid Password";
	} else {
		errors.password = null;
	}

	if (!formState.confirmPassword) {
		errors.confirmPassword = "Confirm Password is required";
	} else if (
		!validateConfirmPassword(formState.password, formState.confirmPassword)
	) {
		errors.confirmPassword = "Passwords do not match";
	} else {
		errors.confirmPassword = null;
	}

	if (!formState.macAddress) {
		errors.macAddress = "Mac Address is required";
	} else if (!validateMacAddress(formState.macAddress)) {
		errors.macAddress = "Invalid Mac Address";
	} else {
		errors.macAddress = null;
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
	// regex with 8 symbols, 1 uppercase, 1 lowercase, 1 number, 1 special character
	const re =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return re.test(password);
}

export function validateConfirmPassword(password, confirmPassword) {
	return password === confirmPassword;
}

export function validateMacAddress(macAddress) {
	const re = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	return re.test(macAddress);
}
