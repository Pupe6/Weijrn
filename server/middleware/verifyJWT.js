const jwt = require("jsonwebtoken");

const BannedToken = require("../models/BannedToken");
const User = require("../models/User");

async function verifyJWT(req, res, next) {
	const token = req.headers["x-token"] || req.body.token || req.query.token;

	try {
		if (!token)
			return res
				.status(403)
				.json({ message: "A token is required for authentication." });

		if (await BannedToken.findOne({ token }))
			return res.status(403).json({
				message: "This token is expired. Please login again.",
			});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

	try {
		const decodedJWT = jwt.verify(token, process.env.TOKEN_KEY);

		const user = (await User.findOne({ _id: decodedJWT._id })).toJSON();

		delete user.password;
		delete user._token;

		req.user = user;
	} catch (err) {
		console.log(err);
		return res.status(401).json({ message: "Invalid Token." });
	}

	return next();
}

module.exports = verifyJWT;
