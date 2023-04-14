const User = require("../models/User");

async function verifyUUID(req, res, next) {
	try {
		const uuid = req.headers["x-uuid"] || req.body.uuid || req.query.uuid;

		if (!uuid) return res.status(403).json({ message: "UUID is required" });

		// Find User By UUID
		const user = await User.findOne({ uuid }).populate("_tags");

		if (!user) return res.status(404).json({ message: "User Not Found" });

		req.user = user;

		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

module.exports = verifyUUID;
