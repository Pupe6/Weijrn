const Tag = require("../models/Tag");
const Status = require("../models/Status");

const verifyMAC = require("../middleware/verifyMAC");

const { encrypt } = require("../utils/encryption");

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

router.post("/pending", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		let statusUpdate = await Status.findOne({ macAddress });

		if (!statusUpdate) {
			statusUpdate = new Status({ macAddress });

			await statusUpdate.save();
		}

		if (statusUpdate.raspiSend.status) {
			if (!statusUpdate.raspiSend.pending) {
				statusUpdate.raspiSend.pending = true;

				await statusUpdate.save();

				return res.status(200).json({ message: "Success" });
			} else {
				return res.status(400).json({ message: "Already pending." });
			}
		} else if (statusUpdate.raspiReceive.status) {
			if (!statusUpdate.raspiReceive.pending) {
				statusUpdate.raspiReceive.pending = true;

				await statusUpdate.save();

				return res.status(200).json({ message: "Success" });
			} else {
				return res.status(400).json({ message: "Already pending." });
			}
		} else {
			return res.status(400).json({ message: "No action required." });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/send", verifyMAC, async (req, res) => {
	try {
		const { macAddress } = req.user;

		let statusUpdate = await Status.findOne({ macAddress });

		if (!statusUpdate) {
			statusUpdate = new Status({ macAddress });

			await statusUpdate.save();
		}

		const { nickname } = req.body;

		if (!nickname)
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		statusUpdate.raspiSend = {
			status: true,
			pending: false,
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

		let statusUpdate = await Status.findOne({ macAddress });

		if (!statusUpdate) {
			statusUpdate = new Status({ macAddress });

			await statusUpdate.save();
		}

		const { _id } = req.body;

		if (!_id)
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		// Get the tag from the database
		const tag = await Tag.findById(_id);

		if (!tag) return res.status(404).json({ message: "Tag not found." });

		const encryptedData = encrypt(tag.data, process.env.ENCRYPTION_KEY);

		statusUpdate.raspiReceive = {
			status: true,
			pending: false,
			tag: {
				...tag.toJSON(),
				data: encryptedData,
			},
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
					pending: false,
					tag: null,
				},
				raspiSend: {
					status: false,
					pending: false,
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
