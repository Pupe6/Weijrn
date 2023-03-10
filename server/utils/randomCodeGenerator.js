function randomCodeGenerator(length) {
	let result = "";

	const possibleCharacters = "0123456789";

	for (let i = 0; i < length; i++)
		result += possibleCharacters.charAt(
			Math.floor(Math.random() * possibleCharacters.length)
		);

	return result;
}

module.exports = randomCodeGenerator;
