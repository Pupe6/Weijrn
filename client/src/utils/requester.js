const baseUrl = "http://127.0.0.1:8393";

const requester = async (
	method,
	path,
	body = undefined,
	token = null,
	macAddress = null
) => {
	const res = await fetch(`${baseUrl}${path}`, {
		method,
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			"X-Token": token,
			"X-Mac-Address": macAddress,
		},
		body: method !== "GET" ? JSON.stringify(body) : body,
	}).catch(err => {
		throw err;
	});

	const response = await res.json();

	if (!res.ok) {
		throw response;
	}

	return response;
};

export const get = requester.bind(null, "GET");
export const post = requester.bind(null, "POST");
export const put = requester.bind(null, "PUT");
export const del = requester.bind(null, "DELETE");
