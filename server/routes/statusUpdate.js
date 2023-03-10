const Tag = require("../models/Tag");
const Status = require("../models/Status");

const verifyMAC = require("../middleware/verifyMAC");

const { encryptTag } = require("../utils/encryption");

const router = require("express").Router();

router.get("/", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		const statusUpdate = await Status.findOne({ macAddress });

		if (!statusUpdate) {
			const newStatusUpdate = new Status({ macAddress });

			await newStatusUpdate.save();

			return res.status(200).json({ ...newStatusUpdate.toJSON() });
		}

		res.status(200).json({ ...statusUpdate.toJSON() });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/send", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		const statusUpdate = await Status.findOne({ macAddress });

		const { nickname } = req.body;

		if (!nickname)
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		statusUpdate.raspiSend = {
			status: true,
			nickname,
		};

		await statusUpdate.save();

		res.status(200).json({ message: "Success" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/receive", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		const statusUpdate = await Status.findOne({ macAddress });

		const { _id } = req.body;

		if (!_id)
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		// Get the tag from the database
		const tag = await Tag.findById(_id);

		if (!tag) return res.status(404).json({ message: "Tag not found." });

		const encryptedTag = encryptTag(tag);

		statusUpdate.raspiReceive = {
			status: true,
			tag: encryptedTag,
		};

		await statusUpdate.save();

		res.status(200).json({ message: "Success" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/resolve", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		await Status.findOneAndUpdate(
			{ macAddress },
			{
				raspiReceive: {
					status: false,
					tag: null,
				},
				raspiSend: {
					status: false,
					nickname: null,
				},
			}
		);

		res.status(200).json({ message: "Success" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/statusupdate",
	router,
};
