const { Schema, model, models } = require("mongoose");

const tagSchema = new Schema(
	{
		nickname: {
			type: String,
			required: [true, "Tag nickname is required."],
		},
		data: {
			type: String,
			required: [true, "Tag data is required."],
		},
		type: {
			type: String,
			required: [true, "Tag type is required."],
			enum: ["nfc", "rfid", "ir"],
		},
	},
	{ timestamps: true, versionKey: false }
);

const tagModel = models["Tag"] || model("Tag", tagSchema);

module.exports = tagModel;
