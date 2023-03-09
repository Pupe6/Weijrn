const crypto = require("crypto");

const algorithm = "aes-256-ctr";

const encrypt = (text, secretKey) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

	return {
		iv: iv.toString("hex"),
		content: encrypted.toString("hex"),
	};
};

const decrypt = (hash, secretKey) => {
	const decipher = crypto.createDecipheriv(
		algorithm,
		secretKey,
		Buffer.from(hash.iv, "hex")
	);

	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(hash.content, "hex")),
		decipher.final(),
	]);

	return decrypted.toString();
};

const encryptTag = tag => {
	const { data } = tag;

	const encryptedData = encrypt(data, process.env.ENCRYPTION_KEY);

	return { ...tag.toJSON(), data: encryptedData };
};

module.exports = { encrypt, decrypt, encryptTag };
