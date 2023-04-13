const baseUrl = "https://weijrnserver.onrender.com";

const requester = async (
	method,
	path,
	body = undefined,
	token = null,
	macAddress = null
) => {
	let headers = {
		"Content-Type": "application/json",
	};

	if (token) headers["X-Token"] = token;
	if (macAddress) headers["X-Mac-Address"] = macAddress;

	const res = await fetch(`${baseUrl}${path}`, {
		method,
		mode: "cors",
		headers,
		body: method !== "GET" ? JSON.stringify(body) : body,
	}).catch(err => {
		throw err;
	});

	const response = await res.json();

	console.log(response);

	if (response.valid === false) throw new Error("Token is not valid.");

	if (!res.ok) throw response;

	return response;
};

export const get = requester.bind(null, "GET");
export const post = requester.bind(null, "POST");
export const put = requester.bind(null, "PUT");
export const del = requester.bind(null, "DELETE");
