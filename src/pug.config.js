const fs = require("fs");
const yamlParse = require("js-yaml");

const easings = yamlParse.safeLoad(
	fs.readFileSync("./src/easings.yml", "utf8")
);

module.exports = {
	locals: {
		all_easings: easings,
	},
	pretty: false,
};
