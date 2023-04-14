export const validateSignInForm = formState => {
	let errors = {};

	errors.email = validateEmail(formState.email);
	errors.password = validatePassword(formState.password);

	return errors;
};

export const validateSignUpForm = formState => {
	let errors = {};

	errors.username = validateUsername(formState.username);
	errors.email = validateEmail(formState.email);
	errors.password = validatePassword(formState.password);
	errors.confirmPassword = validateConfirmPassword(
		formState.confirmPassword,
		formState.password
	);
	errors.uuid = validateUUID(formState.uuid);

	return errors;
};
export function validateEmail(email) {
	if (!email) return "Email is required";
	const re = /\S+@\S+\.\S+/;

	if (re.test(email)) return null;
	else return "Invalid email";
}

export function validateUsername(username) {
	if (!username) return "Username is required";

	const re = /^[a-zA-Z0-9]+$/;

	if (re.test(username)) return null;
	else return "Invalid username";
}

export function validatePassword(password) {
	if (!password) return "Password is required";

	// regex with 8 symbols, 1 uppercase, 1 lowercase, 1 number, 1 special character
	const re =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

	if (re.test(password)) return null;
	else return "Invalid password";
}

export function validateConfirmPassword(password, confirmPassword) {
	if (!confirmPassword) return "Confirm Password is required";

	if (password === confirmPassword) return null;
	else return "Passwords do not match";
}

export function validateUUID(uuid) {
	if (!uuid) return "UUID is required";

	const re = /^[0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{3}$/i;

	if (re.test(uuid)) return null;
	else return "Invalid UUID";
}
