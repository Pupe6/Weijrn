const router = require("express").Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "API Health Check" });
});

router.get("/favicon", (_, res) => {
	res.status(200).sendFile("favicon.png", {
		root: "./public",
	});
});

module.exports = {
	path: "/",
	router,
};
