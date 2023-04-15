const router = require("express").Router();

const { updateUser, deleteUser } = require("../utils/users");

const verifyJWT = require("../middleware/verifyJWT");

// Update User
router.put("/:id", verifyJWT, async (req, res) => {
	try {
		const user = await updateUser(req.params.id, req.body);

		user.password = undefined;
		user.uuid = undefined;

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
