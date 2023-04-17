export const baseUrl = "http://192.168.0.130:8393";

const requester = async (
	method,
	path,
	body = undefined,
	token = null,
	uuid = null
) => {
	let headers = {
		"Content-Type": "application/json",
	};

	if (token) headers["X-Token"] = token;
	if (uuid) headers["X-UUID"] = uuid;

	const res = await fetch(`${baseUrl}${path}`, {
		method,
		mode: "cors",
		headers,
		body: method !== "GET" ? JSON.stringify(body) : body,
	}).catch(err => {
		throw err;
	});

	const response = await res.json();

	if (response.valid === false) throw new Error("Token is not valid.");

	if (!res.ok) throw response;

	return response;
};

export const get = requester.bind(null, "GET");
export const post = requester.bind(null, "POST");
export const put = requester.bind(null, "PUT");
export const del = requester.bind(null, "DELETE");
