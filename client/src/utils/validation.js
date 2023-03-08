export function validateField({ field, value, ...args }) {
	let error = null;

	switch (field) {
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
		case "macAddress":
			if (!validateMacAddress(value)) {
				error = "Please enter a valid MAC address.";
			}
			break;
		default:
			break;
	}
	return error;
}

export function validateForm(formState) {
	const errors = {};

	for (let key in formState) {
		if (key === "confirmPassword") {
			const error = validateField({
				field: key,
				value: formState[key],
				password: formState.password,
			});
			if (error) {
				errors[key] = error;
			}
			continue;
		}
		const error = validateField({
			field: key,
			value: formState[key],
		});
		if (error) {
			errors[key] = error;
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

export function validateMacAddress(macAddress) {
	const re = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	return re.test(macAddress);
}
