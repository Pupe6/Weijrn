const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Tag = require("../models/Tag");

async function getUsers(query = {}) {
	try {
		const count = await User.countDocuments(query);

		const users = await User.find(query).populate("_tags", ["-data"]);

		return { count, users };
	} catch (err) {
		return { message: err.message };
	}
}

async function updateUser(userId, body) {
	try {
		if (!body.password)
			throw new Error(
				"You must provide your password to update your account."
			);

		const userToUpdate = await User.findById(userId);

		const user = body;

		for (let key in user) {
			if (!user[key]) delete user[key];
		}

		if (!userToUpdate)
			throw new Error("There is no such user with provided id.");

		// Verify User Ownership
		if (!(await bcrypt.compare(user.password, userToUpdate.password)))
			throw new Error("The password you entered is incorrect.");

		const password = user.newPassword || user.password;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ ...user, password: await bcrypt.hash(password, 10) },
			{
				new: true,
			}
		);

		return updatedUser;
	} catch (err) {
		return { message: err.message };
	}
}

async function deleteUser(userId, userPassword) {
	try {
		const userToDelete = await User.findById(userId);

		if (!userToDelete)
			throw new Error("There is no such user with provided id.");

		// Verify User Ownership
		if (!(await bcrypt.compare(userPassword, userToDelete.password)))
			throw new Error("The password you entered is incorrect.");

		// Remove Tags The User Owns From Other Users
		userToDelete._tags.forEach(async tagId => {
			await User.updateMany(
				{ _tags: tagId },
				{ $pull: { _tags: tagId } }
			);
		});

		// Delete All Tags The User Owns
		await Tag.deleteMany({ _owner: userId });

		await User.findByIdAndDelete(userId);

		return { message: "User has been deleted." };
	} catch (err) {
		return { message: err.message };
	}
}

async function createUser(user) {
	try {
		const newUser = await new User(user).save();

		return newUser;
	} catch (err) {
		return { err };
	}
}

module.exports = {
	getUsers,
	updateUser,
	deleteUser,
	createUser,
};
