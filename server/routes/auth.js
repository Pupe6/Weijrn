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
		const { uuid, username, email, password } = req.body;

		if (!(uuid && username && email && password)) {
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });
		}

		// Make Sure The UUID Is Unique
		let userWithSameUUID = (await getUsers({ uuid })).users[0];

		if (userWithSameUUID)
			return res.status(409).json({
				message: "This UUID is already registered.",
			});

		let encryptedPassword = await bcrypt.hash(password, 10);

		let user = await createUser({
			uuid,
			username,
			email: email.toLowerCase(),
			password: encryptedPassword,
		});

		// Check For Validation Errors
		if (user.err) {
			let { err } = user;
			let duplicateErrCodes = [11000, 11001];

			if (duplicateErrCodes.includes(err.code)) {
				return res.status(409).json(formatDuplicateError(err));
			}

			return res.status(400).json(formatValidationError(err));
		}

		user._token = jwt.sign(
			{
				_id: user._id,
				username: user.username,
				uuid: user.uuid,
			},
			process.env.TOKEN_KEY
		);

		await user.save();

		res.status(201).json({ ...user.toJSON(), password: undefined });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password))
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		let user = (await getUsers({ email })).users[0];

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{
					_id: user._id,
					username: user.username,
					uuid: user.uuid,
				},
				process.env.TOKEN_KEY
			);

			if (user._token)
				// Ban Old Token
				await BannedToken.create({ token: user._token });

			user._token = token;
			user.lastActivity = Date.now();
			await user.save();

			res.status(200).json({ ...user.toJSON(), password: undefined });
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

// Check Token Validity
router.get("/token", verifyJWT, async (_, res) => {
	try {
		res.status(200).json({ message: "Token is valid.", valid: true });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/auth",
	router,
};
