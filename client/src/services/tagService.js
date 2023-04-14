import * as requester from "../utils/requester";

// GET /jrn/tags

export const getTags = async token => {
	const response = await requester
		.get("/jrn/tags", undefined, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// GET /jrn/tags/:nickname

export const getTag = async (nickname, uuid) => {
	const response = await requester
		.get(`/jrn/tags/${nickname}`, undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /jrn/tags/:nickname

export const createTag = async (nickname, uuid) => {
	const response = await requester
		.post(`/statusupdate/send`, { nickname }, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// PUT   /jrn/tags/:x-token

export const updateTag = async (nickname, token, newNickname) => {
	const response = await requester
		.put(`/jrn/tags/${nickname}`, { nickname: newNickname }, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// DELETE  /jrn/tags/:x-token

export const deleteTag = async (nickname, token) => {
	const response = await requester
		.del(`/jrn/tags/${nickname}`, undefined, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// GET /statusupdate

export const statusUpdate = async uuid => {
	const response = await requester
		.get("/statusupdate", undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /statusupdate/receive

export const receiveStatusUpdate = async (uuid, _id) => {
	const response = await requester
		.post("/statusupdate/receive", { _id }, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};
// GET /jrn/tags/share/:code

export const getSharedTag = async (code, uuid) => {
	const response = await requester
		.get(`/jrn/tags/share/${code}`, undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /jrn/tags/share/:nickname

export const shareTag = async (nickname, uuid) => {
	const response = await requester
		.post(`/jrn/tags/share/${nickname}`, undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};
