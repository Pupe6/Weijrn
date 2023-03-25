const { Schema, model, models } = require("mongoose");

const tagSchema = new Schema(
	{
		_owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Tag owner is required."],
		},
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
			enum: {
				values: ["nfc", "rfid", "ir"],
				message:
					"Tag type must be one of the following: nfc, rfid, ir.",
			},
		},
	},
	{ timestamps: true, versionKey: false }
);

const tagModel = models["Tag"] || model("Tag", tagSchema);

module.exports = tagModel;
