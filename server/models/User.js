const { Schema, model, models } = require("mongoose");

const userSchema = new Schema(
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
				'"{VALUE}" is not a valid email.',
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
		lastActivity: {
			type: Date,
			default: new Date(),
		},
		_token: {
			type: String,
		},
	},
	{ timestamps: true, versionKey: false }
);

const userModel = models["User"] || model("User", userSchema);

module.exports = userModel;
