const Tag = require("../models/Tag");
const User = require("../models/User");

const verifyMAC = require("../middleware/verifyMAC");
const verifyJWT = require("../middleware/verifyJWT");

const router = require("express").Router();
const { encrypt } = require("../utils/encryption");
const { verify } = require("jsonwebtoken");

router.get("/tags", verifyMAC, async (req, res) => {
	try {
		const user = req.user;

		const tags = await Tag.find({ _id: { $in: user._tags } });

		res.status(200).json({ tags });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/tags/:nickname", verifyMAC, async (req, res) => {
	try {
		const { nickname } = req.params;
		const user = req.user;

		const tag = user._tags.find(tag => tag.nickname === nickname);

		if (!tag)
			return res
				.status(404)
				.json({ message: `Tag "${nickname}" not found.` });

		let encryptedData = encrypt(tag.data, process.env.ENCRYPTION_KEY);

		res.status(200).json({
			tag: { ...tag.toJSON(), data: encryptedData },
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/tags", verifyMAC, async (req, res) => {
	try {
		const { nickname, data, type } = req.body;
		const user = req.user;

		if (!(nickname && data && type))
			return res
				.status(400)
				.json({ message: "Please fullfil all fields." });

		let errorMessage = "";

		if (user._tags.find(tag => tag.nickname === nickname))
			errorMessage += `Tag "${nickname}" already exists.\n`;

		const tagWithSameData = user._tags.find(tag => tag.data === data);

		if (tagWithSameData)
			errorMessage += `Tag "${tagWithSameData.nickname}" already has the same data.\n`;

		if (errorMessage)
			return res.status(400).json({ message: errorMessage });

		const tag = await Tag.create({ nickname, data, type });

		// check for validation errors
		if (tag.err) {
			let { err } = tag;
			let duplicateErrCodes = [11000, 11001];

			if (duplicateErrCodes.includes(err.code)) {
				return res.status(409).json(formatDuplicateError(err));
			}

			return res.status(400).json(formatValidationError(err));
		}

		user._tags.push(tag._id);
		await user.save();

		res.status(201).json({ tag: { ...tag.toJSON(), data: undefined } });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.put("/tags/:nickname", verifyJWT, async (req, res) => {
	try {
		const { nickname } = req.params;
		const { nickname: newNickname, data, type } = req.body;

		const tagToUpdate = await Tag.findOne({ nickname });

		if (!tagToUpdate)
			return res
				.status(404)
				.json({ message: `Tag "${nickname}" not found.` });

		const updatedTag = await Tag.findOneAndUpdate(
			{ nickname },
			{ nickname: newNickname, data, type },
			{ new: true }
		);

		res.status(200).json({ tag: updatedTag });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.delete("/tags/:nickname", verifyJWT, async (req, res) => {
	try {
		const { nickname } = req.params;
		const user = req.user;

		console.log(user._id);

		const tagToDelete = await Tag.findOneAndDelete({ nickname });

		await User.findOneAndUpdate(
			{ _id: user._id },
			{
				$pull: { _tags: tagToDelete._id },
			}
		);

		res.status(200).json({ message: `Tag "${nickname}" deleted.` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/jrn",
	router,
};
