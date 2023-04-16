const router = require("express").Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "API Health Check" });
});

router.get("/favicon", (_, res) => {
	res.status(200).sendFile("favicon.png", {
		root: "./public",
	});
});

router.get("/loading", (_, res) => {
	res.status(200).sendFile("loading.gif", {
		root: "./public",
	});
});

module.exports = {
	path: "/",
	router,
};
