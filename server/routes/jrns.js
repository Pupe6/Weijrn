const Tag = require("../models/Tag");
const User = require("../models/User");
const ShareCode = require("../models/ShareCode");

const verifyMAC = require("../middleware/verifyMAC");
const verifyJWT = require("../middleware/verifyJWT");

const { encrypt } = require("../utils/encryption");
const randomCodeGenerator = require("../utils/randomCodeGenerator");

const router = require("express").Router();

router.get("/tags", verifyMAC, async (req, res) => {
	try {
		const user = req.user;

		const tags = await Tag.find({ _id: { $in: user._tags } });

		// Remove Data From Tags
		tags.forEach(tag => (tag.data = undefined));

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

		res.status(200).json({
			tag: tag.toJSON(),
			data: undefined,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/tags", verifyMAC, async (req, res) => {
	try {
		const { _owner, nickname, data, type } = req.body;
		const user = req.user;

		if (!(_owner && nickname && data && type))
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

		const encryptedData = encrypt(data, process.env.ENCRYPTION_KEY);

		const tag = await Tag.create({
			_owner,
			nickname,
			data: encryptedData,
			type,
		});

		// Check For Validation Errors
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

		const tagToUpdate = await Tag.findOne({
			nickname,
			_owner: req.user._id,
		});

		if (!tagToUpdate)
			return res.status(404).json({
				message: `Tag "${nickname}" not found or you are not authorized to update it.`,
			});

		const updatedTag = await Tag.findOneAndUpdate(
			{ nickname },
			{ nickname: newNickname, data, type },
			{ new: true }
		);

		res.status(200).json({ tag: updatedTag, data: undefined });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.delete("/tags/:nickname", verifyJWT, async (req, res) => {
	try {
		const { nickname } = req.params;
		const user = req.user;

		const tagToDelete = await Tag.findOne({ nickname, _owner: user._id });

		if (!tagToDelete)
			return res.status(404).json({
				message: `Tag "${nickname}" not found or you are not authorized to delete it.`,
			});

		await Tag.deleteOne({ nickname, _owner: user._id });

		// Remove Tag From All Users
		await User.updateMany(
			{ _tags: tagToDelete._id },
			{ $pull: { _tags: tagToDelete._id } }
		);

		// Delete All Share Codes For Tag
		await ShareCode.deleteMany({ _tag: tagToDelete._id });

		res.status(200).json({ message: `Tag "${nickname}" deleted.` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post("/tags/share/:nickname", verifyMAC, async (req, res) => {
	try {
		const { nickname } = req.params;
		const user = req.user;

		const tagId = user._tags.find(tag => tag.nickname === nickname)?._id;

		if (!tagId)
			return res
				.status(404)
				.json({ message: `Tag "${nickname}" not found.` });

		let randomCode = randomCodeGenerator(6);

		// Regenerate Code If It Already Exists
		while (await ShareCode.findOne({ shareCode: randomCode }))
			randomCode = randomCodeGenerator(6);

		const shareCode = await ShareCode.create({
			_tag: tagId,
			shareCode: randomCode,
		});

		res.status(200).json({ shareCode });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get("/tags/share/:code", verifyMAC, async (req, res) => {
	try {
		const { code } = req.params;
		const user = req.user;

		const tag = (await ShareCode.findOne({ shareCode: code }))?._tag;

		if (!tag)
			return res
				.status(404)
				.json({ message: `Share code "${code}" not found.` });

		// Make Sure User Doesn't Already Have Tag
		if (user._tags.some(userTag => userTag._id.equals(tag)))
			return res
				.status(400)
				.json({ message: "You already have this tag." });

		let userToUpdate = await User.findOne({ _id: user._id });

		userToUpdate._tags.push(tag);
		await userToUpdate.save();

		// Remove Share Code
		await ShareCode.findOneAndDelete({ shareCode: code });

		res.status(200).json({ message: "Tag shared." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/jrn",
	router,
};
