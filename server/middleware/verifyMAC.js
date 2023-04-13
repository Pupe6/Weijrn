const User = require("../models/User");

async function verifyMAC(req, res, next) {
	try {
		const macAddress =
			req.headers["x-mac-address"] ||
			req.body.macAddress ||
			req.query.macAddress;

		if (!macAddress)
			return res.status(403).json({ message: "MAC Address is required" });

		// Find User By MAC Address
		const user = await User.findOne({ macAddress }).populate("_tags");

		if (!user) return res.status(404).json({ message: "User Not Found" });

		req.user = user;

		next();
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
}

module.exports = verifyMAC;
