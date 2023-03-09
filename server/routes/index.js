const router = require("express").Router();

router.get("/", (_, res) => {
	res.status(200).json({ message: "API Health Check" });
});

module.exports = {
	path: "/",
	router,
};
