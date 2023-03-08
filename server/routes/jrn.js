const Tag = require("../models/Tag");

const verifyMAC = require("../middleware/verifyMAC");

const router = require("express").Router();

router.post("/tag", verifyMAC, async (req, res) => {
	try {
		const { nickname, data, type } = req.body;
		const user = req.user;

		if (!nickname)
			return res
				.status(400)
				.json({ message: "Tag nickname is required." });
		if (!data)
			return res.status(400).json({ message: "Tag data is required." });
		if (!type)
			return res.status(400).json({ message: "Tag type is required." });

		let errorMessage = "";

		if (user._tags.find(tag => tag.nickname === nickname))
			errorMessage += `Tag "${nickname}" already exists.\n`;

		const tagWithSameData = user._tags.find(tag => tag.data === data);

		if (tagWithSameData)
			errorMessage += `Tag "${tagWithSameData.nickname}" already has the same data.\n`;

		if (errorMessage)
			return res.status(400).json({ message: errorMessage });

		const tag = await Tag.create({ nickname, data, type });

		user._tags.push(tag._id);
		await user.save();

		res.status(201).json({ tag });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = {
	path: "/jrn",
	router,
};
