const Tag = require("../models/Tag");
const Status = require("../models/Status");

const verifyUUID = require("../middleware/verifyUUID");

const router = require("express").Router();

router.get("/", verifyUUID, async (req, res) => {
	try {
		const { uuid } = req.user;

		let statusUpdate = await Status.findOne({ uuid });

		if (!statusUpdate) {
			statusUpdate = new Status({ uuid });

			await statusUpdate.save();
		}

		res.status(200).json({ ...statusUpdate.toJSON() });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/pending", verifyUUID, async (req, res) => {
	try {
		const { uuid } = req.user;

		let statusUpdate = await Status.findOne({ uuid });

		if (!statusUpdate) {
			statusUpdate = new Status({ uuid });

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

router.post("/send", verifyUUID, async (req, res) => {
	try {
		const { uuid } = req.user;

		let statusUpdate = await Status.findOne({ uuid });

		if (!statusUpdate) {
			statusUpdate = new Status({ uuid });

			await statusUpdate.save();
		}

		// Make sure we are not receiving a tag while sending one
		if (statusUpdate.raspiSend.status)
			return res.status(400).json({ message: "Already sending a tag." });

		// Make sure we are not sending a tag while receiving one
		if (statusUpdate.raspiReceive.status)
			return res
				.status(400)
				.json({ message: "Already receiving a tag." });

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

router.post("/receive", verifyUUID, async (req, res) => {
	try {
		const { uuid } = req.user;

		let statusUpdate = await Status.findOne({ uuid });

		if (!statusUpdate) {
			statusUpdate = new Status({ uuid });

			await statusUpdate.save();
		}

		// Make sure we are not receiving a tag while sending one
		if (statusUpdate.raspiSend.status)
			return res.status(400).json({ message: "Already sending a tag." });

		// Make sure we are not sending a tag while receiving one
		if (statusUpdate.raspiReceive.status)
			return res
				.status(400)
				.json({ message: "Already receiving a tag." });

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
		res.status(500).json({ message: err.message });
	}
});

router.post("/resolve", verifyUUID, async (req, res) => {
	try {
		const { uuid } = req.user;

		let status = await Status.findOne({ uuid });

		if (!status) {
			status = new Status({ uuid });
		} else {
			status.raspiSend = {
				status: false,
				pending: false,
				nickname: null,
			};

			status.raspiReceive = {
				status: false,
				pending: false,
				tag: null,
			};
		}

		await status.save();

		res.status(200).json({ message: "Success" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/statusupdate",
	router,
};
