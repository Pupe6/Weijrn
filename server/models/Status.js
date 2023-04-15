const { Schema, model, models } = require("mongoose");

const statusSchema = new Schema(
	{
		uuid: {
			type: String,
			required: [true, "UUID is required."],
			match: [
				// 12 characters long, 4 groups of 3 characters separated by hyphens
				/^[0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{3}$/i,
				'"{VALUE}" is not a valid UUID.',
			],
		},
		raspiReceive: {
			status: {
				type: Boolean,
				default: false,
			},
			pending: {
				type: Boolean,
				default: false,
			},
			tag: {
				type: Object,
				default: null,
			},
		},
		raspiSend: {
			status: {
				type: Boolean,
				default: false,
			},
			pending: {
				type: Boolean,
				default: false,
			},
			nickname: {
				type: String,
				default: null,
			},
		},
	},
	{ timestamps: true, versionKey: false }
);

const statusModel = models["Status"] || model("Status", statusSchema);

module.exports = statusModel;
