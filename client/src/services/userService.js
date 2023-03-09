import * as requester from "../utils/requester";

// POST /auth/register
export const registerUser = async (username, email, password, macAddress) => {
	const response = await requester
		.post("/auth/register", {
			username,
			email,
			password,
			macAddress,
		})
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /auth/login
export const loginUser = async (email, password) => {
	const response = await requester
		.post("/auth/login", {
			email,
			password,
		})
		.catch(err => {
			throw err;
		});

	return response;
};

// GET /auth/logout
export const logoutUser = async () => {
	const response = await requester.get("/auth/logout").catch(err => {
		throw err;
	});

	return response;
};
