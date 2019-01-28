const path = require("path");
const cwd = process.cwd();

const pwd = path.join(cwd, "..");
const dist = "docs";

module.exports = {
	path: {
		pwd: pwd,
		helpers: path.join(pwd, "helpers"),

		src: {
			templates: path.join(pwd, "src", "templates"),

			css: path.join(pwd, "src", "app", "css"),
			js: path.join(pwd, "src", "app", "js"),
			svg: path.join(pwd, "src", "app", "svg")
		},
		dist: {
			root: path.join(pwd, dist),
			css: path.join(pwd, dist, "app", "css"),
			js: path.join(pwd, dist, "app", "js"),
			svg: path.join(pwd, dist, "app", "img")
		}
	}
};