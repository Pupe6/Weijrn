import * as requester from "../utils/requester";

// GET /tags

export const getTags = async token => {
	const response = await requester
		.get("/tags", undefined, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /tags/:nickname

export const createTag = async (nickname, uuid) => {
	const response = await requester
		.post(`/statusupdate/send`, { nickname }, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// PUT   /tags/:nickname

export const updateTag = async (nickname, token, newNickname) => {
	const response = await requester
		.put(`/tags/${nickname}`, { nickname: newNickname }, token)
		.catch(err => {
			throw err;
		});

	return response;
};

// DELETE  /tags/:id

export const deleteTag = async (id, token) => {
	const response = await requester
		.del(`/tags/${id}`, undefined, token)
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

// POST /statusupdate/resolve

export const resolveStatusUpdate = async uuid => {
	const response = await requester
		.post("/statusupdate/resolve", undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// GET /tags/share/:code

export const getSharedTag = async (code, uuid) => {
	const response = await requester
		.get(`/tags/share/${code}`, undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};

// POST /tags/share/:nickname

export const shareTag = async (nickname, uuid) => {
	const response = await requester
		.post(`/tags/share/${nickname}`, undefined, null, uuid)
		.catch(err => {
			throw err;
		});

	return response;
};
