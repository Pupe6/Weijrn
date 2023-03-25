import * as requester from "../utils/requester";

// POST /auth/register
export const registerUser = async data => {
	const response = await requester.post("/auth/register", data).catch(err => {
		throw err;
	});

	return response;
};

// POST /auth/login
export const loginUser = async data => {
	const response = await requester.post("/auth/login", data).catch(err => {
		throw err;
	});

	return response;
};

// GET /auth/logout
export const logoutUser = async token => {
	const response = await requester
		.get("/auth/logout", undefined, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// PUT /users/:id
export const updateUser = async (user, id, token) => {
	const response = await requester
		.put(`/users/${id}`, user, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// DELETE /users/:id

export const deleteUser = async (id, token, password) => {
	const response = await requester
		.del(`/users/${id}`, { password }, token)
		.catch(err => {
			throw err;
		});

	return response;
};
