const { Schema, model, models } = require("mongoose");

const shareCodeSchema = new Schema(
	{
		shareCode: {
			type: String,
			required: [true, "Please provide a code."],
			unique: true,
			match: [/^[0-9]{6}$/, "Code must be 6 digits long."],
		},
		_tag: {
			type: Schema.Types.ObjectId,
			ref: "Tag",
			required: [true, "Please provide a tagId."],
		},
	},
	{ timestamps: true, versionKey: false }
);

const shareCodeModel =
	models["ShareCode"] || model("ShareCode", shareCodeSchema);

module.exports = shareCodeModel;
