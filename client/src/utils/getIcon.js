export const getIcon = screenName => {
	switch (screenName) {
		case "Home":
			return "home";
		case "Admin":
			return "account-details";
		case "SignIn":
			return "login";
		case "SignUp":
			return "account-plus";
		case "Sign Out":
			return "logout";
		default:
			return undefined;
	}
};
