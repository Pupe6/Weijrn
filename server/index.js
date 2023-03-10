require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const ShareCode = require("./models/ShareCode");

const app = express();

const routesPath = path.join(__dirname, "routes");

app.use(express.json());

// Set CORS With Whitelist Array
let whitelistedDomains = process.env.WHITELISTED_DOMAINS.split(", ");
let allowedOrigins =
	process.env.NODE_ENV === "production"
		? whitelistedDomains
		: ["http://localhost:19006", "http://127.0.0.1:19006"];

app.use(
	cors({
		origin: allowedOrigins,
		optionsSuccessStatus: 200,
	})
);

app.use((req, res, next) => {
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin))
		res.setHeader("Access-Control-Allow-Origin", origin);

	res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.set("Access-Control-Allow-Headers", "Content-Type, X-Token, Origin");

	next();
});

// Check All Share Codes And Delete Them If They Are Expired (15 Minutes); This Runs Every 5 Minutes
setInterval(async () => {
	const shareCodes = await ShareCode.find();

	shareCodes.forEach(async shareCode => {
		const now = new Date();
		const createdAt = shareCode.createdAt;

		const diff = now.getTime() - createdAt.getTime();
		const minutes = Math.floor(diff / 1000 / 60);

		if (minutes >= 15) {
			await ShareCode.findByIdAndDelete(shareCode._id);
		}
	});
}, 1000 * 60 * 5);

// Register Routes
try {
	fs.readdirSync(routesPath).forEach(file => {
		const route = require(path.join(routesPath, file));
		app.use(route.path, route.router);
	});

	app.all("*", (_, res) =>
		res.status(404).json({
			message: "Not found",
		})
	);
} catch (err) {
	console.log(err);

	app.all("*", (_, res) =>
		res.status(500).json({
			message: "Internal server error",
		})
	);
}

const port = process.env.PORT || 8393;

// Connect To MongoDB
mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");

		// Start The Server
		app.listen(port, () => console.log(`Server started on port ${port}`));
	});
