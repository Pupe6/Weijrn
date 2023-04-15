const jwt = require("jsonwebtoken");

const BannedToken = require("../models/BannedToken");
const User = require("../models/User");

async function verifyJWT(req, res, next) {
	const token = req.headers["x-token"] || req.body.token || req.query.token;

	try {
		if (!token)
			return res.status(403).json({
				message: "A token is required for authentication.",
				valid: false,
			});

		if (await BannedToken.findOne({ token }))
			return res.status(403).json({
				message: "This token is expired. Please login again.",
				valid: false,
			});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}

	try {
		const decodedJWT = jwt.verify(token, process.env.TOKEN_KEY);

		const user = await User.findOne({ _id: decodedJWT._id }).populate(
			"_tags"
		);

		// Update user's lastActivity timestamp
		await User.updateOne(
			{ _id: user._id },
			{ $set: { lastActivity: new Date() } }
		);

		// Check if user has been active within the last 30 minutes
		const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

		if (user.lastActivity.getTime() < thirtyMinutesAgo.getTime()) {
			// Delete user's token
			await User.updateOne({ _id: user._id }, { $set: { _token: null } });

			// Ban token
			await BannedToken.create({ token });

			return res.status(403).json({
				message:
					"This token is expired due to inactivity. Please login again.",
				valid: false,
			});
		}

		// Attach user object to request for other middleware to use
		delete user.password;
		delete user._token;

		req.user = user;
	} catch (err) {
		return res
			.status(401)
			.json({ message: "Invalid Token.", valid: false });
	}

	return next();
}

module.exports = verifyJWT;
