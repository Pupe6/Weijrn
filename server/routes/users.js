const router = require("express").Router();

const { getUsers, updateUser, deleteUser } = require("../utils/users");

const verifyJWT = require("../middleware/verifyJWT");

// Get All Users
router.get("/", async (_, res) => {
	try {
		const { err, count, users } = await getUsers({});

		if (err) throw err;

		users.forEach(user => {
			user._token = undefined;
			user.password = undefined;
			user.macAddress = undefined;
		});

		res.status(200).json({ users, count });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get User By Id
router.get("/:id", async (req, res) => {
	try {
		const { err, users } = await getUsers({
			_id: req.params.id,
		});

		if (err) throw err;

		const user = users[0];

		user._token = undefined;
		user.password = undefined;
		user.macAddress = undefined;

		if (!users) throw new Error("There is no such user with provided id.");

		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update User
router.put("/:id", verifyJWT, async (req, res) => {
	try {
		const user = await updateUser(req.params.id, req.body);

		if (user.err) throw user.err;

		delete user.password;

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

		if (user.err) throw user.err;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/users",
	router,
};
