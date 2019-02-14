const path = require("path");
const pwd = process.cwd();

const dist = "dist";

module.exports = {
	path: {
		pwd: pwd,
		helpers: path.join(pwd, "helpers"),

		src: {
			templates: path.join(pwd, "src", "templates"),

			css: path.join(pwd, "src", "app", "css"),
			js: path.join(pwd, "src", "app", "js"),
			svg: path.join(pwd, "src", "app", "svg"),
			img: path.join(pwd, "src", "app", "img"),

			static: path.join(pwd, "static")
		},
		dist: {
			root: path.join(pwd, dist),
			css: path.join(pwd, dist, "app", "css"),
			js: path.join(pwd, dist, "app", "js"),
			svg: path.join(pwd, dist, "app", "img"),
			img: path.join(pwd, dist, "app", "img"),

			static: path.join(pwd, dist)
		}
	}
};
