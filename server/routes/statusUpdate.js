const Tag = require("../models/Tag");
const { encryptTag } = require("../utils/encryption");

const router = require("express").Router();

// this endpoint is pinged every 5 seconds by both client and hardware
// we use it to tell the client or hardware if an action is required
router.get("/", (req, res) => {
	res.status(200).json({ ...global.statusUpdate });
});

router.post("/send", (req, res) => {
	const { nickname } = req.body;

	if (!nickname)
		return res.status(400).json({ message: "Please fullfil all fields." });

	global.statusUpdate.raspiSend = {
		status: true,
		nickname,
	};

	res.status(200).json({ message: "Success" });
});

router.post("/receive", async (req, res) => {
	try {
		const { _id } = req.body;

		if (!_id)
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		// Get the tag from the database
		const tag = await Tag.findById(_id);

		if (!tag) return res.status(404).json({ message: "Tag not found." });

		const encryptedTag = encryptTag(tag);

		global.statusUpdate.raspiReceive = {
			status: true,
			tag: encryptedTag,
		};

		res.status(200).json({ message: "Success" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/resolve", (_, res) => {
	global.statusUpdate.raspiSend = {
		status: false,
		nickname: null,
	};

	global.statusUpdate.raspiReceive = {
		status: false,
		tag: null,
	};

	res.status(200).json({ message: "Success" });
});

module.exports = {
	path: "/statusupdate",
	router,
};
