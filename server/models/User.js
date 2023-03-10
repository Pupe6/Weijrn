const { Schema, model, models } = require("mongoose");

const userSchema = new Schema(
	{
		macAddress: {
			type: String,
			required: [true, "MAC address is required."],
			match: [
				/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
				'"{VALUE}" is not a valid MAC address.',
			],
		},
		username: {
			type: String,
			required: [true, "Username is required."],
			unique: [true, 'The username "{VALUE}" is already taken.'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: [true, 'The email "{VALUE}" is already taken.'],
			match: [
				/^[A-Za-z0-9_\.]+@[A-Za-z]+\.[A-Za-z]{2,3}$/,
				'"{VALUE}" is not a valid email address.',
			],
		},
		password: {
			type: String,
			required: [true, "Password is required."],
		},
		_tags: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Tag",
				},
			],
			default: [],
		},
		_token: {
			type: String,
		},
	},
	{ timestamps: true, versionKey: false }
);

const userModel = models["User"] || model("User", userSchema);

module.exports = userModel;
