const { Schema, model, models } = require("mongoose");

const statusSchema = new Schema(
	{
		macAddress: {
			type: String,
			required: [true, "The MAC address is required."],
			match: [
				/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
				'"{VALUE}" is not a valid MAC address.',
			],
		},
		raspiReceive: {
			status: {
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
