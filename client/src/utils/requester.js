const baseUrl = "https://2d22-194-141-252-114.eu.ngrok.io";
// const baseUrl = "https://weijrnserver.onrender.com";

const requester = async (method, path, body = undefined, token = null) => {
	const res = await fetch(`${baseUrl}${path}`, {
		method,
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			"X-Token": token,
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
