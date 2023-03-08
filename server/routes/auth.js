const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { createUser, getUsers } = require("../utils/users");
const verifyJWT = require("../middleware/verifyJWT");

const {
	formatValidationError,
	formatDuplicateError,
} = require("../utils/validationErrorFormatter");

const User = require("../models/User");
const BannedToken = require("../models/BannedToken");

router.post("/register", async (req, res) => {
	try {
		const { macAddress, username, email, password } = req.body;

		if (!(macAddress && username && email && password)) {
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });
		}

		let encryptedPassword = await bcrypt.hash(password, 10);

		let user = await createUser({
			macAddress,
			username,
			email: email.toLowerCase(),
			password: encryptedPassword,
		});

		// check for validation errors
		if (user.err) {
			let { err } = user;
			let duplicateErrCodes = [11000, 11001];

			if (duplicateErrCodes.includes(err.code)) {
				return res.status(409).json(formatDuplicateError(err));
			}

			return res.status(400).json(formatValidationError(err));
		}

		user._token = jwt.sign(
			{ ...user, password: undefined },
			process.env.TOKEN_KEY
		);

		await user.save();

		delete user.password;

		res.status(201).json({ user: user.toJSON() });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			return res.status(400).json({ message: "All input is required." });
		}

		let user = (await getUsers({ email })).users[0];

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(user.toJSON(), process.env.TOKEN_KEY);

			// Ban Old Token
			await BannedToken.create({ token: user._token });

			user._token = token;
			await user.save();

			res.status(200).json({ user: user.toJSON() });
		} else {
			res.status(400).json({ message: "Invalid Credentials." });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/logout", verifyJWT, async (req, res) => {
	try {
		const token = req.headers["x-token"];

		if (!token)
			return res.status(400).json({ message: "No session found." });

		await User.findOneAndUpdate({ _token: token }, { _token: null });

		// Ban Old Token
		await BannedToken.create({ token });

		res.status(200).json({ message: "Logged out successfully." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/auth",
	router,
};
