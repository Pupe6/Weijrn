const Tag = require("../models/Tag");
const Status = require("../models/Status");

const verifyMAC = require("../middleware/verifyMAC");

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
		console.log(err);
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
		console.log(err);
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

		const { nickname, _owner } = req.body;

		if (!(nickname && _owner))
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		statusUpdate.raspiSend = {
			status: true,
			pending: false,
			nickname,
			_owner,
		};

		await statusUpdate.save();

		res.status(200).json({ message: "Success" });
	} catch (err) {
		console.log(err);
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

		const tag = await Tag.findById(_id);

		if (!tag) return res.status(404).json({ message: "Tag not found." });

		statusUpdate.raspiReceive = {
			status: true,
			pending: false,
			tag: tag.toJSON(),
		};

		await statusUpdate.save();

		res.status(200).json({ message: "Success" });
	} catch (err) {
		console.log(err);
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
		console.log(err);
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/statusupdate",
	router,
};
