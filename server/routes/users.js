const router = require("express").Router();

const { updateUser, deleteUser } = require("../utils/users");

const verifyJWT = require("../middleware/verifyJWT");

const {
	formatValidationError,
	formatDuplicateError,
} = require("../utils/validationErrorFormatter");

// Update User
router.put("/:id", verifyJWT, async (req, res) => {
	try {
		const user = await updateUser(req.params.id, req.body);

		// Check For Validation Errors
		if (user.err) {
			let { err } = user;
			let duplicateErrCodes = [11000, 11001];

			if (duplicateErrCodes.includes(err.code)) {
				return res
					.status(409)
					.json({ message: formatDuplicateError(err) });
			}

			return res
				.status(400)
				.json({ message: formatValidationError(err) });
		}

		user.password = undefined;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Delete User
router.delete("/:id", verifyJWT, async (req, res) => {
	try {
		if (!req.body.password)
			throw new Error(
				"You must provide your password to update your account."
			);

		const user = await deleteUser(req.params.id, req.body.password);

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/users",
	router,
};
